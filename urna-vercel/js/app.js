let digits = "", state = "vote", blank = false, lastVote = null;
const $ = id => document.getElementById(id);

function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ return mem; } }
let mem = [];
function save(v){ mem = v; try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch(e){} }

function beep(f=880,d=.12){
  try{ const a=new (window.AudioContext||window.webkitAudioContext)(), o=a.createOscillator(), g=a.createGain();
  o.type="square"; o.frequency.value=f; g.gain.value=.05; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+d);}catch(e){}
}

function foto(c){
  let f=null; try{ f=localStorage.getItem("urna:foto:"+c.num); }catch(e){}
  if(!f) f=c.foto;
  return f ? '<img class="photo" alt="'+c.nome+'" src="'+f+'" style="object-fit:cover">'
           : '<div class="photo" style="background:'+c.cor+'">'+c.nome[0]+'</div>';
}
const SONS={tecla:"assets/sons/click.mp3",fim:"assets/sons/confirma.mp3"};
function tocar(k,fb){
  let d=null; try{ d=localStorage.getItem("urna:som:"+k); }catch(e){}
  if(!d) d=SONS[k];
  if(d){ try{ new Audio(d).play().catch(fb); return; }catch(e){} }
  fb();
}
function tecla(){ tocar("tecla",()=>beep(1250,.09)); }
function fim(){ tocar("fim",()=>beep(1000,1.6)); }
function cand(){ return CANDIDATOS.find(c=>c.num===digits)||(digits===EGG.num?EGG:undefined); }

function render(){
  const s = $("screen");
  if(state==="end"){
    s.innerHTML = '<div class="big">FIM</div><div class="foot">Voto registrado. Aguarde...</div>';
    return;
  }
  let body = "";
  if(blank){
    body = '<div class="big" style="font-size:34px">VOTO EM BRANCO</div>';
  } else {
    let boxes = "";
    for(let i=0;i<2;i++) boxes += '<div class="d">'+(digits[i]||"")+'</div>';
    let info = "", cargo = "Presidente";
    if(digits.length===2){
      const c = cand(); if(c&&c.cargo) cargo=c.cargo;
      info = c
        ? '<div class="cand">'+foto(c)+'<div class="info"><b>Nome:</b> '+c.nome+'<br><b>Partido:</b> '+c.partido+(c.cargo?'<br><small>★ Easter egg</small>':'')+'</div></div>'
        : '<div class="info" style="margin-top:10px"><b>NÚMERO ERRADO</b><br><b>VOTO NULO</b></div>';
    }
    body = '<div>Seu voto para</div><h2 style="font-size:20px;margin:4px 0">'+cargo+'</h2><div class="digits">'+boxes+'</div>'+info;
  }
  s.innerHTML = '<h2>Simulação · Eleição Presidencial</h2>'+body+
    '<div class="foot">Aperte a tecla:<br>VERDE para CONFIRMAR este voto<br>LARANJA para REINICIAR este voto</div>';
}

function press(n){
  if(state!=="vote"||blank||digits.length>=2) return;
  digits += n; tecla(); render();
}
function branco(){ if(state!=="vote"||digits.length) return; blank=true; tecla(); render(); }
function corrige(){ if(state!=="vote") return; digits=""; blank=false; tecla(); render(); }
function confirma(){
  if(state!=="vote") return;
  let tipo, num = "", nome = "";
  if(blank) tipo="branco";
  else if(digits.length===2){ const c=cand(); if(c){tipo=c.cargo?"especial":"candidato";num=c.num;nome=c.nome;} else {tipo="nulo";num=digits;} }
  else { beep(300,.2); return; }
  const v = load();
  v.push({id:v.length+1, tipo, numero:num, candidato:nome, data:new Date().toISOString()});
  save(v);
  state="end"; render();
  fim();
  setTimeout(()=>{ state="vote"; digits=""; blank=false; render(); }, 3200);
}

// teclado
const pad = $("pad");
[1,2,3,4,5,6,7,8,9].forEach(n=>pad.insertAdjacentHTML("beforeend",'<button class="k" data-n="'+n+'">'+n+'</button>'));
pad.insertAdjacentHTML("beforeend",'<button class="k" style="grid-column:2" data-n="0">0</button>');
pad.insertAdjacentHTML("beforeend",'<button class="k b" id="kb">BRANCO</button><button class="k c" id="kc">CORRIGE</button><button class="k ok" id="ko">CONFIRMA</button>');
pad.addEventListener("click",e=>{ const n=e.target.dataset.n; if(n!==undefined) press(n); });
$("kb").onclick=branco; $("kc").onclick=corrige; $("ko").onclick=confirma;
document.addEventListener("keydown",e=>{
  if(/^[0-9]$/.test(e.key)) press(e.key);
  else if(e.key==="Enter") confirma();
  else if(e.key==="Backspace"||e.key==="Escape") corrige();
});

// resultados
function fmt(d){ return new Date(d).toLocaleString("pt-BR"); }
function showResults(){
  const v = load(), esp = v.filter(x=>x.tipo==="especial"), total = v.length-esp.length;
  const cnt = c => v.filter(x=>x.tipo==="candidato"&&x.numero===c.num).length;
  const br = v.filter(x=>x.tipo==="branco").length, nu = v.filter(x=>x.tipo==="nulo").length;
  const pct = n => total? (n*100/total).toFixed(1)+"%":"0%";
  let h = '<h2 style="margin-top:0">Resultado da votação</h2><div>Total de votos: <b>'+total+'</b></div>';
  CANDIDATOS.forEach(c=>{ const n=cnt(c); h+='<div class="row"><span style="width:150px">'+c.nome+' ('+c.num+')</span><div class="bar2" style="background:'+c.cor+';width:'+(total?n*100/total*2:0)+'px"></div><b>'+n+' ('+pct(n)+')</b></div>'; });
  h += '<div class="row"><span style="width:150px">Brancos</span><b>'+br+' ('+pct(br)+')</b></div>';
  h += '<div class="row"><span style="width:150px">Nulos</span><b>'+nu+' ('+pct(nu)+')</b></div>';
  if(esp.length) h += '<div class="row"><span style="width:150px">★ '+EGG.nome+' ('+EGG.num+')</span><b>'+esp.length+' (easter egg, fora da contagem)</b></div>';
  const winner = [...CANDIDATOS].sort((a,b)=>cnt(b)-cnt(a));
  if(total) h += '<p><b>'+(cnt(winner[0])===cnt(winner[1])?'Empate':'Na frente: '+winner[0].nome)+'</b></p>';
  h += '<h3>Fotos dos candidatos</h3>'+CANDIDATOS.map(c=>'<div class="row"><span style="width:200px">'+c.nome+'</span><input type="file" accept="image/*" data-foto="'+c.num+'"></div>').join("")+'<small>As fotos oficiais já estão incluídas. Escolha outra do seu aparelho só se quiser trocar (fica salva neste navegador).</small>'+
    '<h3>Sons da urna</h3>'+
    [["tecla","Som das teclas"],["fim","Som do CONFIRMA (FIM)"]].map(x=>'<div class="row"><span style="width:200px">'+x[1]+'</span><input type="file" accept="audio/*" data-som="'+x[0]+'"><button class="link" data-testar="'+x[0]+'">Testar</button><button class="link" data-limpar="'+x[0]+'">Padrão</button></div>').join("")+
    '<small>A urna já vem com os sons originais. Envie outro mp3/wav (até ~1 MB) só se quiser trocar; "Padrão" volta aos sons originais.</small>';
  h += '<h3>Registro de cada voto</h3><div class="log"><table><tr><th>#</th><th>Voto</th><th>Data/hora</th></tr>'+
    v.slice().reverse().map(x=>'<tr><td>'+x.id+'</td><td>'+(x.tipo==="candidato"?x.candidato+' ('+x.numero+')':x.tipo==="especial"?'★ '+x.candidato+' ('+x.numero+') · Easter egg':x.tipo==="nulo"?'Nulo ('+x.numero+')':'Branco')+'</td><td>'+fmt(x.data)+'</td></tr>').join("")+'</table></div>'+
    '<div class="bar"><button class="link" id="cp">Copiar CSV</button><button class="danger" id="zr">Zerar urna</button><button class="link" id="fc">Fechar</button></div>';
  const r = $("res"); r.innerHTML = h; r.style.display="block";
  $("fc").onclick=()=>r.style.display="none";
  r.querySelectorAll("input[data-som]").forEach(inp=>inp.onchange=()=>{
    const f=inp.files[0]; if(!f) return;
    if(f.size>1.2e6){ alert("Arquivo grande demais (máx. ~1 MB)."); return; }
    const fr=new FileReader(); fr.onload=()=>{
      try{ localStorage.setItem("urna:som:"+inp.dataset.som, fr.result); alert("Som salvo!"); }catch(e){ alert("Não foi possível salvar o som."); }
    }; fr.readAsDataURL(f);
  });
  r.querySelectorAll("[data-testar]").forEach(b=>b.onclick=()=>b.dataset.testar==="fim"?fim():tecla());
  r.querySelectorAll("[data-limpar]").forEach(b=>b.onclick=()=>{ try{ localStorage.removeItem("urna:som:"+b.dataset.limpar); }catch(e){} alert("Voltou ao som padrão."); });
  r.querySelectorAll("input[data-foto]").forEach(inp=>inp.onchange=()=>{
    const f=inp.files[0]; if(!f) return;
    const img=new Image(); img.onload=()=>{
      const cv=document.createElement("canvas"); cv.width=240; cv.height=300;
      const ctx=cv.getContext("2d"), k=Math.max(240/img.width,300/img.height), w=img.width*k, hh=img.height*k;
      ctx.drawImage(img,(240-w)/2,(300-hh)/2,w,hh);
      try{ localStorage.setItem("urna:foto:"+inp.dataset.foto, cv.toDataURL("image/jpeg",.85)); alert("Foto salva!"); }catch(e){ alert("Não foi possível salvar a foto."); }
    };
    img.src=URL.createObjectURL(f);
  });
  $("zr").onclick=()=>{ if(confirm("Apagar TODOS os votos? Isso não pode ser desfeito.")){ save([]); showResults(); } };
  $("cp").onclick=()=>{
    const csv = "id;tipo;numero;candidato;data\n"+v.map(x=>[x.id,x.tipo,x.numero,x.candidato,x.data].join(";")).join("\n");
    (navigator.clipboard?navigator.clipboard.writeText(csv):Promise.reject()).then(()=>alert("CSV copiado!")).catch(()=>prompt("Copie o CSV:",csv));
  };
}
$("btnRes").onclick=()=>{ const p=prompt("Senha do mesário:"); if(p===null) return; if(p===PIN) showResults(); else alert("Senha incorreta."); };

render();

// Service worker (modo aplicativo/offline)
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}
