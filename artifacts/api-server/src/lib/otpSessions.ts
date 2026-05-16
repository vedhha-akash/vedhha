const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface OtpSession {
  identifier: string;
  expires: number;
}

const sessionStore = new Map<string, OtpSession>();

export function mintSession(identifier: string): string {
  const token = crypto.randomUUID();
  sessionStore.set(token, { identifier, expires: Date.now() + SESSION_TTL_MS });
  return token;
}

export function validateSession(token: string, identifier: string): boolean {
  const session = sessionStore.get(token);
  if (!session) return false;
  if (Date.now() > session.expires) {
    sessionStore.delete(token);
    return false;
  }
  return session.identifier === identifier;
}

export function consumeSession(token: string, identifier: string): boolean {
  const valid = validateSession(token, identifier);
  if (valid) sessionStore.delete(token);
  return valid;
}
