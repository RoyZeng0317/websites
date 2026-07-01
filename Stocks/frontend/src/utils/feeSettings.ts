export const BANK_KEY = 'stockinfo_default_bank'

export function getDefaultBank(): string {
  return localStorage.getItem(BANK_KEY) || ''
}

export function setDefaultBank(bank: string): void {
  if (bank) localStorage.setItem(BANK_KEY, bank)
  else localStorage.removeItem(BANK_KEY)
}
