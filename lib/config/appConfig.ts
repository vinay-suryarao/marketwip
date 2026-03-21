const rawAdminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";

export const ADMIN_EMAILS = rawAdminEmails
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return ADMIN_EMAILS.includes(email.toLowerCase());
}
