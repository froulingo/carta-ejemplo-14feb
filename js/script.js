let mensaje = "";
let razones = [];
let PASSWORD = "";
let indice = 0;

/* ===== CARGAR CONFIG DESDE config.json ===== */
async function cargarConfig() {
  try {
    const res = await fetch("./config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar config.json");

    const CONFIG = await res.json();

    mensaje = CONFIG.mensaje || "";
    razones = CONFIG.razones || [];
    PASSWORD = CONFIG.password || "";

    // Títulos dinámicos
    if (CONFIG.titulo) {
      document.title = CONFIG.titulo;
      const h1 = document.getElementById("tituloCarta");
      if (h1 && h1.childNodes[0]) {
        h1.childNodes[0].nodeValue = CONFIG.titulo + " ";
      }
    }
  } catch (e) {
    console.error("Error cargando config.json:", e);
    alert("No se pudo cargar la configuración 😿");
  }
}

document.addEventListener("DOMContentLoaded", cargarConfig);

/* ===== LOGIN ===== */
function checkPassword(){
  const pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("sobreContainer").classList.remove("hidden");
  } else {
    document.getElementById("error").textContent = "Contraseña incorrecta 💔";
  }
}

/* ===== OJITO ===== */
document.getElementById("toggleOjo").addEventListener("click",()=>{
  const input = document.getElementById("password");
  input.type = (input.type === "password") ? "text" : "password";
});

/* ===== ABRIR SOBRE ===== */
function abrirSobre(){
  const sobre = document.querySelector(".sobre");
  sobre.classList.add("abierto");
  explosionInicial();
  setTimeout(()=>{
    document.getElementById("sobreContainer").classList.add("hidden");
    document.getElementById("carta").classList.remove("hidden");
    fadeInMusica();
    escribirTexto();
    lluviaCorazones();
  },1500);
}

/* ===== TEXTO ===== */
function escribirTexto(){
  let i = 0;
  const el = document.getElementById("texto");
  el.innerHTML = "";
  function escribir(){
    if (i < mensaje.length) {
      el.innerHTML += mensaje.charAt(i);
      i++;
      setTimeout(escribir, 35);
    } else {
      document.getElementById("descubrir").classList.remove("hidden");
    }
  }
  escribir();
}

/* ===== SORPRESA ===== */
function preguntarLista(){
  document.getElementById("descubrir").classList.add("hidden");
  document.getElementById("pregunta").classList.remove("hidden");
}

function mostrarRazones(){
  document.getElementById("pregunta").classList.add("hidden");
  document.getElementById("razones").classList.remove("hidden");
  indice = 0;
  mostrarSiguienteRazon();
}

function mostrarSiguienteRazon(){
  if (indice < razones.length) {
    document.getElementById("razonTexto").innerText = razones[indice];
    indice++;
    setTimeout(mostrarSiguienteRazon, 2500);
  } else {
    setTimeout(()=>{ sorpresaFinal(); }, 2000);
  }
}

function sorpresaFinal(){
  formarCorazonFinal();
  explosionInicial();
}

/* ===== BOTÓN NO ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const btnNo = document.getElementById("btnNo");
  if (!btnNo) return;

  btnNo.addEventListener("mouseover",()=>{
    if (window.innerWidth > 600) {
      btnNo.style.position = "absolute";
      btnNo.style.top = Math.random() * 70 + "vh";
      btnNo.style.left = Math.random() * 70 + "vw";
    }
  });

  btnNo.addEventListener("click",()=>{
    if (window.innerWidth <= 600) {
      alert("¡No es sí! 😏");
    }
  });
});

/* ===== CORAZONES OPTIMIZADOS ===== */
let corazonesActivos = 0;
const MAX_CORAZONES = 20;
let intervaloCorazones;
const esMovil = window.innerWidth < 600;

function crearCorazon(left, size, duracion){
  if (corazonesActivos >= MAX_CORAZONES) return;

  corazonesActivos++;
  const cont = document.createElement("div");
  cont.classList.add("corazon");
  cont.style.left = left;
  cont.style.width = size + "px";
  cont.style.height = size + "px";
  cont.style.animationDuration = duracion + "s";

  const colores = ["#ff4b5c","#ff758c","#ff1493","#ff69b4"];
  cont.style.setProperty("--color", colores[Math.floor(Math.random() * colores.length)]);

  const shape = document.createElement("div");
  shape.classList.add("shape");
  cont.appendChild(shape);
  document.body.appendChild(cont);

  setTimeout(()=>{
    cont.remove();
    corazonesActivos--;
  }, duracion * 1000);
}

function lluviaCorazones(){
  if (intervaloCorazones) return;
  intervaloCorazones = setInterval(()=>{
    crearCorazon(
      Math.random() * 100 + "vw",
      esMovil ? Math.random() * 15 + 30 : Math.random() * 25 + 35,
      esMovil ? Math.random() * 2 + 4 : Math.random() * 3 + 5
    );
  }, esMovil ? 700 : 450);
}

document.addEventListener("visibilitychange",()=>{
  if (document.hidden) {
    clearInterval(intervaloCorazones);
    intervaloCorazones = null;
  } else {
    lluviaCorazones();
  }
});

function explosionInicial(){
  for (let i = 0; i < 20; i++) {
    crearCorazon(
      50 + (Math.random() * 20 - 10) + "vw",
      Math.random() * 25 + 20,
      Math.random() * 2 + 2
    );
  }
}

function fadeInMusica(){
  const musica = document.getElementById("musica");
  if (!musica) return;

  musica.volume = 0;
  musica.play().catch(()=>{});
  let vol = 0;
  const fade = setInterval(()=>{
    if (vol < 1) {
      vol += 0.05;
      musica.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 200);
}

/* ===== CORAZÓN FINAL ===== */
function formarCorazonFinal() {
  document.getElementById("razones").classList.add("hidden");
  document.getElementById("finalCorazon").classList.remove("hidden");
  const container = document.getElementById("corazonFormado");
  container.innerHTML = "";

  const num = 80;
  const R = 80;

  for (let i = 0; i < num; i++) {
    const c = document.createElement("div");
    c.classList.add("miniCorazon");

    const t = Math.PI * 2 * i / num;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    c.style.left = (R + x * R / 16) + "px";
    c.style.top = (R + y * R / 16) + "px";

    const colores = ["#ff4b5c", "#ff758c", "#ff1493", "#ff69b4"];
    c.style.background = colores[Math.floor(Math.random() * colores.length)];
    container.appendChild(c);
  }

  setTimeout(()=>{
    const texto = document.getElementById("teAmoTexto");
    if (texto) {
      texto.style.opacity = 1;
      texto.classList.add("latido");
    }
  }, 1000);
}
