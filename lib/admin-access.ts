export const AUTHORIZED_ADMIN_EMAIL = "artsquarein765@gmail.com";

export function isAuthorizedAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
}
