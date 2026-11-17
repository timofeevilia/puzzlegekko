// 81 Trials for two, each on their own phone. The room lives in Firestore and reuses the Gekko Party rules:
// party/<CODE>/game/state is written only by the player who opened the room (the host), party/<CODE>/input/<uid>
// only by that player. Room codes here have five letters, Gekko Party's have four, so the two games never meet.
// The host keeps the order: every action of either player goes into one log in the state document, and both
// screens replay that log, so the puzzles stay identical without sending any puzzle state at all.
let net = null;
const loadNet = async () => (net = net || await import("../shared/net.js"));

class Link {
  constructor({ db, uid, code, host, state }) {
    Object.assign(this, { db, uid, code, host, me: host ? 0 : 1, S: state, subs: [], acts: [], pick: null, timer: 0 });
    this.n = Math.max(state.gn || 0, state.pn || 0);
    const stDoc = db.doc("game/state");
    if (host) {
      this.un = db.col("input").onSnapshot(list => list.forEach(d => this.fromGuest(d.id, d.data)));
      // phones on WebKit sometimes hold back live updates: ask the server directly every few seconds as well
      this.poll = setInterval(async () => { if (!this.S.guest) return; const d = this.db.doc("input/" + this.S.guest); const g = await (d.fresh || d.get)().catch(() => null); if (g?.exists) this.fromGuest(this.S.guest, g.data()); }, 3000);
    } else {
      this.un = stDoc.onSnapshot(s => s.exists && this.fromHost(s.data()));
      this.poll = setInterval(async () => { const s = await (stDoc.fresh || stDoc.get)().catch(() => null); if (s?.exists) this.fromHost(s.data()); }, 3000);
      this.send();
    }
  }
  on(fn) { this.subs.push(fn); }
  emit() { this.subs.forEach(f => f(this.S)); }
  close() { clearInterval(this.poll); clearTimeout(this.timer); try { this.un?.(); } catch { } this.subs = []; }

  // ── the host
  fromGuest(id, d) {
    const S = this.S; let changed = false;
    if (!S.guest) { S.guest = id; changed = true; } else if (S.guest !== id) return;
    for (const a of d.acts || []) { // each carries its sequence number _n and the run _r it was made in
      if (a._n <= S.gn) continue;
      S.gn = a._n; changed = true;
      if (a._r === S.run && S.trial >= 0) { const { _n, _r, ...rest } = a; S.log.push({ ...rest, w: 1 }); }
    }
    if (d.pick && d.pick.n > S.pn) { S.pn = d.pick.n; this.start(d.pick.i); changed = true; }
    if (changed) { this.save(); this.emit(); }
  }
  start(i) {
    const S = this.S;
    if (i < 0) { S.trial = -1; S.log = []; return; }
    S.run++; S.trial = i; S.seed = Math.random() * 2 ** 31 | 0; S.log = [];
  }
  save() { clearTimeout(this.timer); this.timer = setTimeout(() => { this.S.t = Date.now(); this.db.doc("game/state").set(this.S).catch(e => console.warn("save", e)); }, 50); }

  // ── the guest
  fromHost(s) {
    const S = this.S;
    if (S && s.t && S.t && (s.t < S.t || (s.t === S.t && s.run === S.run && s.log.length === S.log.length && s.guest === S.guest))) return; // older or the same
    this.S = s; this.acts = this.acts.filter(a => a._n > (s.gn || 0)); this.emit();
  }
  send() { this.db.doc("input/" + this.uid).set({ acts: this.acts, pick: this.pick, t: Date.now() }).catch(e => console.warn("send", e)); }

  // ── both
  act(a) {
    if (this.host) { if (this.S.trial < 0) return; this.S.log.push({ ...a, w: 0 }); this.save(); this.emit(); return; }
    this.n++; this.acts.push({ ...a, _n: this.n, _r: this.S.run }); this.acts = this.acts.filter(x => x._n > (this.S.gn || 0)); this.send();
  }
  choose(i) {
    if (this.host) { this.start(i); this.save(); this.emit(); return; }
    this.n++; this.pick = { n: this.n, i }; this.send();
  }
}

export async function available() { const n = await loadNet().catch(() => null); return !!n && n.configured(); }

export async function createRoom() {
  const n = await loadNet();
  for (let k = 0; k < 6; k++) {
    const code = n.newRoomCode(5), { uid, db } = await n.openRoom("party", code);
    const ex = await db.doc("game/state").get().catch(() => null);
    if (ex?.exists) continue;
    const state = { host: uid, kind: "xyj", guest: "", run: 0, trial: -1, seed: 0, log: [], gn: 0, pn: 0, t: Date.now() };
    await db.doc("game/state").set(state);
    return new Link({ db, uid, code, host: true, state });
  }
  throw new Error("busy");
}

// opens a room by its code; whoever created it comes back as the host, anyone else takes the second seat
export async function joinRoom(code) {
  const n = await loadNet(), { uid, db } = await n.openRoom("party", code);
  const s = await db.doc("game/state").get();
  if (!s.exists || s.data().kind !== "xyj") throw new Error("noroom");
  const state = s.data();
  if (state.host === uid) return new Link({ db, uid, code, host: true, state });
  if (state.guest && state.guest !== uid) throw new Error("full");
  return new Link({ db, uid, code, host: false, state });
}
export const cleanCode = v => { const s = String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); return s.length === 5 ? s : null; };
