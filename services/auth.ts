/// <reference lib="deno.unstable" />

let kv: Deno.Kv;

async function getKv() {
  if (!kv) {
    kv = await Deno.openKv();
  }
  return kv;
}

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
}

const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

// Create a new session
export async function createSession(): Promise<Session> {
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  const session: Session = {
    id,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  // Get the KV instance
  const kv = await getKv();

  // Store session in KV with expiration
  await kv.set(["sessions", id], session, {
    expireIn: SESSION_DURATION_MS,
  });

  return session;
}

// Verify a session exists and is valid
export async function verifySession(sessionId: string): Promise<boolean> {
  // Get the KV instance
  const kv = await getKv();
  
  const entry = await kv.get<Session>(["sessions", sessionId]);
  
  if (!entry.value) {
    return false;
  }

  const session = entry.value;
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);

  return now < expiresAt;
}

// Delete a session (logout)
export async function deleteSession(sessionId: string): Promise<void> {
  // Get the KV instance
  const kv = await getKv();
  
  await kv.delete(["sessions", sessionId]);
}

// Verify admin password
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable not set");
    return false;
  }

  return password === adminPassword;
}