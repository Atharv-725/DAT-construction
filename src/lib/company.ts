import companyExample from '../data/company.example.json';

export interface Registration {
  label: string;
  number: string;
  documentPath?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  validUntil?: string;
  documentPath?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface CompanyData {
  legalName: string;
  displayName: string;
  tagline: string;
  phone: {
    display: string;
    dial: string;
  };
  whatsapp: string;
  email: string;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  geo: {
    lat: number | null;
    lng: number | null;
  };
  googleMapsUrl: string;
  googleBusinessProfileUrl: string;
  registrations: Registration[];
  certifications: Certification[];
  stats: Stat[];
  companyProfilePdf: string;
}

// Load company.json dynamically if present, falling back to company.example.json
let loadedCompany: CompanyData = companyExample as CompanyData;

try {
  // Astro / Vite dynamic import fallback
  const customCompany = await import('../data/company.json');
  if (customCompany && customCompany.default) {
    loadedCompany = { ...companyExample, ...customCompany.default } as CompanyData;
  }
} catch {
  // company.json might not exist in git environment, fallback to company.example.json
  loadedCompany = companyExample as CompanyData;
}

export function getCompanyData(): CompanyData {
  return loadedCompany;
}

export function hasPhone(company: CompanyData = loadedCompany): boolean {
  return Boolean(company.phone && company.phone.display && company.phone.dial);
}

export function hasWhatsapp(company: CompanyData = loadedCompany): boolean {
  return Boolean(company.whatsapp);
}

export function hasEmail(company: CompanyData = loadedCompany): boolean {
  return Boolean(company.email);
}

export function hasAddress(company: CompanyData = loadedCompany): boolean {
  return Boolean(company.address && (company.address.line1 || company.address.city));
}

export function hasRegistrations(company: CompanyData = loadedCompany): boolean {
  return Array.isArray(company.registrations) && company.registrations.some(r => Boolean(r.label && r.number && r.documentPath));
}

export function hasCertifications(company: CompanyData = loadedCompany): boolean {
  return Array.isArray(company.certifications) && company.certifications.some(c => Boolean(c.name && c.documentPath));
}

export function hasStats(company: CompanyData = loadedCompany): boolean {
  return Array.isArray(company.stats) && company.stats.some(s => Boolean(s.label && s.value));
}
