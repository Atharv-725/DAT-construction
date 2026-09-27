import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const STORAGE_DIR = process.env.VERCEL ? os.tmpdir() : process.cwd();
const ACCOUNTS_FILE_PATH = path.resolve(STORAGE_DIR, 'customers.json');

export interface CustomerUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastLoginAt: string;
  passwordHash: string;
  salt: string;
}

export interface UserPublicProfile {
  id: string;
  email: string;
  fullName: string;
  token: string;
  createdAt: string;
}

function getAccountsRaw(): CustomerUser[] {
  if (!fs.existsSync(ACCOUNTS_FILE_PATH)) return [];
  try {
    const data = fs.readFileSync(ACCOUNTS_FILE_PATH, 'utf8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function saveAccountsRaw(accounts: CustomerUser[]): void {
  try {
    fs.writeFileSync(ACCOUNTS_FILE_PATH, JSON.stringify(accounts, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save customer accounts:', err);
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSessionToken(email: string, id: string): string {
  const payload = `${id}:${email}:${Date.now()}`;
  return crypto.createHmac('sha256', 'DAT_CONST_SECRET_KEY_2026').update(payload).digest('hex');
}

export function findCustomerByEmail(email: string): CustomerUser | undefined {
  const accounts = getAccountsRaw();
  const normalizedEmail = email.toLowerCase().trim();
  return accounts.find((acc) => acc.email.toLowerCase() === normalizedEmail);
}

export function createCustomerAccount(fullName: string, email: string, password: string): UserPublicProfile {
  const normalizedEmail = email.toLowerCase().trim();
  const accounts = getAccountsRaw();

  if (accounts.some((acc) => acc.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();
  const id = 'cust_' + crypto.randomBytes(8).toString('hex');

  const newUser: CustomerUser = {
    id,
    email: normalizedEmail,
    fullName: fullName.trim() || normalizedEmail.split('@')[0],
    createdAt: now,
    lastLoginAt: now,
    passwordHash,
    salt
  };

  accounts.push(newUser);
  saveAccountsRaw(accounts);

  const token = generateSessionToken(newUser.email, newUser.id);

  return {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    token,
    createdAt: newUser.createdAt
  };
}

export function authenticateCustomer(email: string, password: string): UserPublicProfile {
  const normalizedEmail = email.toLowerCase().trim();
  const accounts = getAccountsRaw();
  const userIndex = accounts.findIndex((acc) => acc.email.toLowerCase() === normalizedEmail);

  if (userIndex === -1) {
    throw new Error('Invalid email or password. Please check your credentials.');
  }

  const user = accounts[userIndex];
  const computedHash = hashPassword(password, user.salt);

  if (computedHash !== user.passwordHash) {
    throw new Error('Invalid email or password. Please check your credentials.');
  }

  // Update last login
  accounts[userIndex].lastLoginAt = new Date().toISOString();
  saveAccountsRaw(accounts);

  const token = generateSessionToken(user.email, user.id);

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    token,
    createdAt: user.createdAt
  };
}
