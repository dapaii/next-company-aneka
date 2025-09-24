import { getSessionCookie } from './cookies';
import { verifySession, SessionPayload } from './jwt';

export async function getSession(): Promise<SessionPayload | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionPayload> {
  const sess = await getSession();
  if (!sess || sess.role !== 'admin') throw new Error('FORBIDDEN');
  return sess;
}
