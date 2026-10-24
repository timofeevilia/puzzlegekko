// Plays 200 random games against the pure rules engine in index.html and fails on stuck phases or bad numbers.
// Run: node tests/simulate.js
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(process.argv[2]||require('path').join(__dirname,'..','index.html'),'utf8');
const js=src.slice(src.indexOf('/* ================= DATA'),src.indexOf('/* ================= NETWORK'));
const ctx={console,Math,JSON,Date,setTimeout,window:{},localStorage:{getItem(){return null},setItem(){}}};vm.createContext(ctx);
vm.runInContext(js+';this.api={newGame,doRoll,doBuy,doEnd,doChallenge,doMini,doJailPay,canBuild,doManage,buyoutable,doBuyout,buyoutPrice,doLoan,doRepay,doStock,netWorth,loanLimit,season,B,ASSETS,canMortgage,makeMini};',ctx);
const A=ctx.api;let stats={games:0,turns:0,buyouts:0,builds:0,minis:0,seasons:new Set(),over:0,maxRound:0,loans:0,stocks:0};
for(let g=0;g<200;g++){
  const s=A.newGame([{name:"A",tok:"x"},{name:"B",tok:"y"}]);stats.games++;
  for(let t=0;t<400&&s.phase!=="over";t++){
    let guard=0;
    while(s.phase!=="end"&&s.phase!=="over"&&guard++<20){
      if(s.phase==="mini"){stats.minis++;A.doMini(s,100,"won");continue}
      if(s.phase==="roll"){const pl=s.players[s.turn];
        if(Math.random()<.3&&pl.cash>300){A.doStock(s,A.ASSETS[t%3].k,2);stats.stocks++}
        if(Math.random()<.1){A.doLoan(s,200);stats.loans++}
        const bo=A.buyoutable(s,s.turn).filter(i=>pl.cash>=A.buyoutPrice(i)+200);if(bo.length&&!s.didBuyout){A.doBuyout(s,bo[0]);stats.buyouts++}
        for(let i=0;i<40;i++)if(A.canBuild(s,s.turn,i)&&pl.cash>400){A.doManage(s,i,"build");stats.builds++}
        if(pl.cash<0){ // raise money
          for(let i=0;i<40&&pl.cash<0;i++)if(A.canMortgage(s,s.turn,i))A.doManage(s,i,"mort");
          if(pl.cash<0){s.phase="over";stats.over++;break}}
        A.doRoll(s);continue}
      if(s.phase==="buy"){A.doBuy(s,true);continue}
      if(s.phase==="challenge"){A.doChallenge(s,Math.random()<.5);continue}
      throw new Error("stuck phase "+s.phase)}
    if(s.phase==="over")break;
    const pl=s.players[s.turn];
    if(pl.cash<0){for(let i=0;i<40&&pl.cash<0;i++)if(A.canMortgage(s,s.turn,i))A.doManage(s,i,"mort");if(pl.cash<0){stats.over++;break}}
    if(pl.loan&&pl.cash>pl.loan+500)A.doRepay(s,pl.loan);
    A.doEnd(s);stats.turns++;stats.seasons.add(A.season(s).n);stats.maxRound=Math.max(stats.maxRound,s.round);
    for(const k in s.mk){if(!(s.mk[k].p>0))throw new Error("bad price")}
    s.players.forEach(p=>{if(!Number.isFinite(p.cash))throw new Error("NaN cash")});
  }
}
stats.seasons=[...stats.seasons];console.log(JSON.stringify(stats));
