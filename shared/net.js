// Firebase for PuzzleGekko (auth + Firestore), shared by every game on the site.
// Each game keeps its data under its own top-level collection: <game>/<ROOM>/...
// The returned db mirrors the small part of the claude.ai `db` API the games use:
// db.doc(path).onSnapshot / get / set / update / delete, plus db.col(path).onSnapshot for a whole sub-collection.
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
  // reuse the account this browser already has (anonymous or Google), so a reload keeps your seat
  const existing = await new Promise(res => { const un = auth.onAuthStateChanged(a, u => { un(); res(u); }); });
  if (!existing) await auth.signInAnonymously(a);
  return { fs, db: fs.getFirestore(app), auth, a };
}
const services = () => (ready = ready || init());

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I
export function newRoomCode(len = 4) {
  let s = "";
  for (let i = 0; i < len; i++) s += ALPHABET[Math.random() * ALPHABET.length | 0];
  return s;
}
export function cleanRoomCode(v, min = 4, max = 8) {
  const s = String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return s.length >= min && s.length <= max ? s : null;
}

// documents under a fixed path prefix, e.g. store("golden-land/K7QX").doc("game/current")
export async function store(prefix) {
  const { fs, db } = await services();
  const ref = p => fs.doc(db, `${prefix}/${p}`);
  const wrap = snap => ({ exists: snap.exists(), data: () => snap.data() });
  const err = e => ({ code: e.code || "unavailable", message: e.message || String(e) });
  const doc = p => ({
    onSnapshot: (next, onErr) => fs.onSnapshot(ref(p), s => next(wrap(s)), e => onErr && onErr(err(e))),
    get: async () => wrap(await fs.getDoc(ref(p))),
    // straight from the server, skipping the local cache (used to resync a listener that went quiet)
    fresh: async () => wrap(await fs.getDocFromServer(ref(p))),
    set: d => fs.setDoc(ref(p), d),
    // claude.ai `update` merges nested objects; Firestore does that with set(..., {merge:true})
    update: d => fs.setDoc(ref(p), d, { merge: true }),
    delete: () => fs.deleteDoc(ref(p)),
  });
  // every document of a sub-collection, e.g. col("players").onSnapshot(list => ...), list = [{id, data}]
  const col = p => ({
    onSnapshot: (next, onErr) => fs.onSnapshot(fs.collection(db, `${prefix}/${p}`),
      s => next(s.docs.map(d => ({ id: d.id, data: d.data() }))), e => onErr && onErr(err(e))),
  });
  return { doc, col };
}

export async function openRoom(game, room) {
  const { a } = await services();
  return { uid: a.currentUser.uid, db: await store(`${game}/${room}`) };
}

// accounts: everyone starts as an anonymous guest; Google sign-in gives a profile that follows you across devices
export async function currentUser() {
  const { a } = await services();
  const u = a.currentUser;
  return u && { uid: u.uid, anonymous: u.isAnonymous, name: u.displayName || "", email: u.email || "" };
}
export async function signInWithGoogle() {
  const { auth, a } = await services();
  await auth.signInWithPopup(a, new auth.GoogleAuthProvider());
  return currentUser();
}
export async function signOutToGuest() {
  const { auth, a } = await services();
  await auth.signOut(a);
  await auth.signInAnonymously(a);
  return currentUser();
}
