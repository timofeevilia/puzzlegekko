// Online rooms for PuzzleGekko games, backed by Firebase (anonymous auth + Firestore).
// Each game keeps its rooms under its own top-level collection: <game>/<ROOM>/...
// The returned db mirrors the small part of the claude.ai `db` API the games use:
// db.doc(path).onSnapshot / get / set / update / delete.
import { FIREBASE_CONFIG } from "./firebase-config.js";

const CDN = "https://www.gstatic.com/firebasejs/10.12.2/";
let ready = null;

export function configured() {
  return !!(FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith("PASTE"));
}

async function init() {
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(CDN + "firebase-app.js"),
    import(CDN + "firebase-auth.js"),
    import(CDN + "firebase-firestore.js"),
  ]);
  const app = initializeApp(FIREBASE_CONFIG);
  const a = auth.getAuth(app);
  // reuse the anonymous account this browser already has, so a reload keeps your seat
  const existing = await new Promise(res => { const un = auth.onAuthStateChanged(a, u => { un(); res(u); }); });
  const user = existing || (await auth.signInAnonymously(a)).user;
  return { fs, db: fs.getFirestore(app), uid: user.uid };
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I
export function newRoomCode(len = 4) {
  let s = "";
  for (let i = 0; i < len; i++) s += ALPHABET[Math.random() * ALPHABET.length | 0];
  return s;
}
export function cleanRoomCode(v) {
  const s = String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return s.length >= 4 && s.length <= 8 ? s : null;
}

export async function openRoom(game, room) {
  ready = ready || init();
  const { fs, db, uid } = await ready;
  const ref = p => fs.doc(db, `${game}/${room}/${p}`);
  const wrap = snap => ({ exists: snap.exists(), data: () => snap.data() });
  const err = e => ({ code: e.code || "unavailable", message: e.message || String(e) });
  const doc = p => ({
    onSnapshot: (next, onErr) => fs.onSnapshot(ref(p), s => next(wrap(s)), e => onErr && onErr(err(e))),
    get: async () => wrap(await fs.getDoc(ref(p))),
    set: d => fs.setDoc(ref(p), d),
    // claude.ai `update` merges nested objects; Firestore does that with set(..., {merge:true})
    update: d => fs.setDoc(ref(p), d, { merge: true }),
    delete: () => fs.deleteDoc(ref(p)),
  });
  return { uid, db: { doc } };
}
