import type { APIRoute } from 'astro';
import ExcelJS from 'exceljs';
import path from 'node:path';
import fs from 'node:fs';

export const prerender = false;

const EXCEL_FILE_PATH = path.resolve(process.cwd(), 'quote_requests.xlsx');
const QUEUE_FILE_PATH = path.resolve(process.cwd(), 'quote_requests_pending.json');

interface QuoteRecord {
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  scope: string;
  message: string;
  status: string;
}

function getQueue(): QuoteRecord[] {
  if (!fs.existsSync(QUEUE_FILE_PATH)) return [];
  try {
    const raw = fs.readFileSync(QUEUE_FILE_PATH, 'utf8');
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QuoteRecord[]) {
  try {
    fs.writeFileSync(QUEUE_FILE_PATH, JSON.stringify(queue, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save queue:', err);
  }
}

async function tryFlushQueueAndAdd(newRecords: QuoteRecord[]): Promise<boolean> {
  const currentQueue = getQueue();
  const allRecords = [...currentQueue, ...newRecords];

  if (allRecords.length === 0) return true;

  const workbook = new ExcelJS.Workbook();
  let worksheet: ExcelJS.Worksheet;

  if (fs.existsSync(EXCEL_FILE_PATH)) {
    try {
      await workbook.xlsx.readFile(EXCEL_FILE_PATH);
      worksheet = workbook.getWorksheet('Quote Requests') || workbook.getWorksheet(1) || workbook.addWorksheet('Quote Requests');
    } catch {
      worksheet = workbook.addWorksheet('Quote Requests');
    }
  } else {
    worksheet = workbook.addWorksheet('Quote Requests');
  }

  // Ensure Headers
  if (!worksheet.getRow(1).cellCount || worksheet.getRow(1).values.length <= 1) {
    worksheet.columns = [
      { header: 'Date & Time', key: 'timestamp', width: 22 },
      { header: 'Full Name', key: 'name', width: 25 },
      { header: 'Phone Number', key: 'phone', width: 18 },
      { header: 'Email Address', key: 'email', width: 25 },
      { header: 'Scope of Work', key: 'scope', width: 32 },
      { header: 'Project Description', key: 'message', width: 50 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0F172A' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 28;
  }

  for (const record of allRecords) {
    worksheet.addRow(record);
  }

  try {
    await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
    saveQueue([]);
    return true;
  } catch (err: any) {
    saveQueue(allRecords);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, phone, email, scope, message } = data;

    if (!name || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name and project description are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const formattedDate = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const newRecord: QuoteRecord = {
      timestamp: formattedDate,
      name: name || 'N/A',
      phone: phone || 'N/A',
      email: email || 'N/A',
      scope: scope || 'General Civil Work',
      message: message,
      status: 'New Request'
    };

    // 1. Save to local Excel & Queue
    const savedToExcel = await tryFlushQueueAndAdd([newRecord]);

    // 2. Post to Google Sheets Webhook
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || (import.meta as any).env?.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbwy_g7bgW9aiXedTw0XfT8ctTGnlN667RwuimcI34g_n5zHhK3tPfHJNdN_Dzmzo3ZC/exec';
    if (googleSheetsUrl) {
      try {
        await fetch(googleSheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
          redirect: 'follow'
        });
      } catch (gsErr) {
        console.warn('Google Sheets sync warning:', gsErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your quote request has been submitted successfully. Our site team will contact you shortly.',
        savedToExcel
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in quote endpoint:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
