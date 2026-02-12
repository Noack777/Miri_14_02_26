const app = document.getElementById("app");
const progressFill = document.querySelector(".progress-fill");
const progressLabel = document.querySelector(".progress-label");
const music = document.getElementById("bg-music");
const heartsLayer = document.getElementById("hearts-layer");
// (visualizador removido)

let progress = 0;
let startedMusic = false;
let finalNoAttempts = 0;
let growingInterval = null;
// (WebAudio visualizador removido)

function setProgress(val) {
  progress = Math.max(0, Math.min(100, val));
  progressFill.style.width = progress + "%";
  progressLabel.textContent = Math.round(progress) + "%";
}

function clearApp() {
  app.innerHTML = "";
}

function showScreen(html) {
  clearApp();
  const wrapper = document.createElement("section");
  wrapper.className = "screen";
  wrapper.innerHTML = html;
  app.appendChild(wrapper);
  requestAnimationFrame(() => {
    wrapper.classList.add("active");
  });
}

function showOverlay(message, buttonText, onClose) {
  const ov = document.createElement("div");
  ov.className = "overlay hidden";
  const card = document.createElement("div");
  card.className = "overlay-card";
  const t = document.createElement("div");
  t.className = "text";
  t.innerHTML = message.replace(/\n/g, "<br>");
  const btn = document.createElement("button");
  btn.className = "btn secondary";
  btn.textContent = buttonText;
  btn.addEventListener("click", () => {
    ov.remove();
    if (typeof onClose === "function") onClose();
  });
  card.appendChild(t);
  card.appendChild(btn);
  ov.appendChild(card);
  document.body.appendChild(ov);
  requestAnimationFrame(() => {
    ov.classList.add("show");
    ov.classList.remove("hidden");
  });
}

function resetGame() {
  setProgress(0);

  document.querySelector(".bg").classList.remove("final-mode");

  finalNoAttempts = 0;
  if (growingInterval) {
    clearInterval(growingInterval);
    growingInterval = null;
  }

  music.pause();
  music.currentTime = 0;
  startedMusic = false;

  renderInitial();

  
}


function renderInitial() {
  showScreen(`
    <h1 class="title">Miri, preciosa, ¿Estás lista para iniciar?</h1>
    <div class="options">
      <button class="btn secondary" id="yes">Sí</button>
      <button class="btn" id="no">No</button>
    </div>
  `);
  document.getElementById("yes").addEventListener("click", () => {
    if (!startedMusic) startMusic();
    renderQ2();
  });
  document.getElementById("no").addEventListener("click", () => {
    showOverlay(
      "No hay afán mi cielo, tengo todo el tiempo de mi existencia para dedicártelo a ti y solo a ti ❤️",
      "Volver",
      renderInitial
    );
  });
}

function renderQ2() {
  showScreen(`
    <h2 class="title">¿Recuerdas dónde nos vimos por primera vez?</h2>
    <div class="options">
      <button class="btn" id="metro">Estación de metro</button>
      <button class="btn" id="mall">Centro comercial</button>
      <button class="btn" id="concert">Entrada del concierto</button>
    </div>
  `);
  document.getElementById("metro").addEventListener("click", () => {
    animateProgressTo(20, () => {
      showOverlay(
        "Exacto, fue en la estación de tren, que de hecho yo estuve prefiriendo quedarme con Mars que ir con los demás a comer aunque me estaba muriendo de hambre, pero al día de hoy fue de las mejores decisiones que he tomado.",
        "Continuar",
        renderQ3
      );
    });
  });
  const wrong = () => {
    showOverlay(
      "Nop preciosa, esa respuesta es incorrecta, inténtalo de nuevo ♥️",
      "Continuar",
      resetGame
    );
  };
  document.getElementById("mall").addEventListener("click", wrong);
  document.getElementById("concert").addEventListener("click", wrong);
}

function renderQ3() {
  showScreen(`
    <h2 class="title">¿Qué crees que fue lo primero que pensé cuando te vi?</h2>
    <div class="options">
      <button class="btn" id="linda">Que eras muy linda</button>
      <button class="btn" id="hablar">Que quería hablar contigo</button>
      <button class="btn" id="diferente">Que eras diferente</button>
      <button class="btn secondary" id="magic">Oh oh oh, it's magic ✨</button>
    </div>
  `);
  document.getElementById("magic").addEventListener("click", () => {
    animateProgressTo(40, () => {
      showOverlay("Porque en ese instante todo se sintió mágico ✨", "Continuar", renderQ4);
    });
  });
  document.getElementById("linda").addEventListener("click", () => {
    showOverlay("O sea sí lo eres, no hay duda, pero no fue lo primero que pensé 😌", "Continuar", resetGame);
  });
  document.getElementById("hablar").addEventListener("click", () => {
    showOverlay("Soy otaku y gamer, estaría nervioso todo el tiempo al intentarlo >w<", "Continuar", resetGame);
  });
  document.getElementById("diferente").addEventListener("click", () => {
    showOverlay("Eres única y detergente, pero no fue lo primero :3", "Continuar", resetGame);
  });
}

function renderQ4() {
  showScreen(`
    <h2 class="title">¿Recuerdas quién le dijo 'Amor' a quién por primera vez?</h2>
    <div class="options">
      <button class="btn secondary" id="miri">Miri</button>
      <button class="btn" id="noack">Noack</button>
    </div>
  `);
  document.getElementById("miri").addEventListener("click", () => {
    animateProgressTo(60, () => {
      showOverlay(
        "Es correcto exactamente fue el Lunes 17 de noviembre del 2025 a las 10 y 53 de la mañana, ¿por qué lo tengo tan claro? Porque aunque a lo mejor lo usaste solo como expresión y no para llamarme, el que me lo digas significa mucho para mí <3",
        "Continuar",
        renderQ5
      );
    });
  });
  document.getElementById("noack").addEventListener("click", () => {
    showOverlay(
      "No estás del todo equivocada, aunque si hubiese tomado la iniciativa no lo hice por temor a espantarte XD, pero no, no fui yo >w<",
      "Reintentar",
      resetGame
    );
  });
}

function renderQ5() {
  showScreen(`
    <h2 class="title">¿Cuál de nuestros dos 'ranchos' es más rancho?</h2>
    <div class="options">
      <button class="btn" id="noackRancho">Rancho de Noack porque no hay ninguna tienda de flores cerca</button>
      <button class="btn secondary" id="miriRancho">Rancho de Miri porque le cortan la luz a cada rato</button>
    </div>
  `);
  document.getElementById("noackRancho").addEventListener("click", () => {
    animateProgressTo(80, () => {
      showOverlay("Al menos a mí no me cortan la electricidad seguido UwU", "Continuar", renderFinalQuestion);
    });
  });
  document.getElementById("miriRancho").addEventListener("click", () => {
    animateProgressTo(80, () => {
      showOverlay("No me consta, iré a comprobarlo pronto >w<", "Continuar", renderFinalQuestion);
    });
  });
}

function renderFinalQuestion() {
  showScreen(`
    <h2 class="title">Después de todo esto… ¿quieres seguir escribiendo esta historia conmigo? ❤️</h2>
    <div class="final-actions" id="finalActions" style="position:relative">
      <button class="btn secondary beat" id="finalYes" style="width:100%">Sí</button>
      <button class="btn" id="finalNo">No</button>
    </div>
  `);
  const yes = document.getElementById("finalYes");
  const no = document.getElementById("finalNo");
  const container = document.getElementById("finalActions");

  let targetWidth = 60;  // empieza más pequeño
  yes.style.width = "60%";
  yes.classList.add("heartbeat");


  if (growingInterval) clearInterval(growingInterval);
  growingInterval = setInterval(() => {
    targetWidth = Math.min(80, targetWidth + 2); // crece más notorio
    yes.style.width = targetWidth + "%";
  }, 300);


  const evade = () => {
    finalNoAttempts += 1;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const w = no.offsetWidth;
    const h = no.offsetHeight;
    const maxLeft = Math.max(0, cw - w);
    const maxTop = Math.max(0, ch - h);
    let left = Math.floor(Math.random() * maxLeft);
    let top = Math.floor(Math.random() * maxTop);
    const contRect = container.getBoundingClientRect();
    const yesRect = yes.getBoundingClientRect();
    let tries = 0;
    const overlaps = () => {
      const candLeft = contRect.left + left;
      const candTop = contRect.top + top;
      const candRight = candLeft + w;
      const candBottom = candTop + h;
      return !(candRight < yesRect.left || candLeft > yesRect.right || candBottom < yesRect.top || candTop > yesRect.bottom);
    };
    while (overlaps() && tries < 12) {
      left = Math.floor(Math.random() * maxLeft);
      top = Math.floor(Math.random() * maxTop);
      tries++;
    }
    if (overlaps()) {
      left = Math.max(0, yes.offsetLeft - w - 8);
      top = Math.max(0, yes.offsetTop - h - 8);
    }
    no.style.position = "absolute";
    no.style.left = left + "px";
    no.style.top = top + "px";
    const scale = Math.max(0.4, 1 - finalNoAttempts * 0.12);
    no.style.transform = "scale(" + scale + ")";
    if (finalNoAttempts >= 5) {
      no.style.opacity = "0";
      setTimeout(() => { no.style.display = "none"; }, 600);
    }
  };

  ["mouseenter","touchstart","pointerdown","click"].forEach(evt => {
    no.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      evade();
    });
  });

yes.addEventListener("click", () => {
  setProgress(100);

  document.querySelector(".bg").classList.add("final-mode");


  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]); // 👈 vibración romántica
  }

  triggerExplosion();
  setTimeout(renderFinalScreen, 1200);
});

}

function animateProgressTo(to, after) {
  const header = document.querySelector(".progress");
  header.classList.add("burst");
  setProgress(to);
  setTimeout(() => {
    header.classList.remove("burst");
    setTimeout(() => { if (typeof after === "function") after(); }, 200);
  }, 700);
}

function triggerExplosion() {
  const layer = document.createElement("div");
  layer.className = "explosion-layer";
  document.body.appendChild(layer);
  const rect = app.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 72;
  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.className = "explosion-heart";
    h.textContent = "♥";
    h.style.left = cx + "px";
    h.style.top = cy + "px";
    layer.appendChild(h);
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 200;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    requestAnimationFrame(() => {
      h.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + (1 + Math.random()*0.6) + ")";
      h.style.opacity = "0";
    });
  }
  setTimeout(() => {
    layer.remove();
  }, 1400);
}

async function startMusic() {
  try {
    music.volume = 0.6;
    await music.play();
    startedMusic = true;
  } catch (err) {
    if (!music.dataset.fallback) {
      music.dataset.fallback = "1";
      music.src = "https://cdn.pixabay.com/download/audio/2022/12/10/audio_7d7394aa09.mp3?filename=romantic-love-130029.mp3";
      try {
        await music.play();
        startedMusic = true;
      } catch (_) {}
    }
  }
}

// (visualizador y pulso de corazones removidos)

function renderFinalScreen() {
  showScreen(`
    <div class="text">
      Gracias por ser parte de mi vida, Miri.<br>
      Desde aquella estación de tren, todo cambió para mí.<br>
      Entre canciones mágicas, palabras inesperadas y nuestros pequeños 'ranchos',<br>
      descubrí que donde tú estás… es donde quiero estar.<br><br>
      Y si pudiera elegir todos los días, siempre te elegiría a ti.<br><br>
      Te quiero ❤️<br><br>
      Feliz 14 de febrero, preciosa 💘
    </div>
    <div class="options" style="max-width:420px">
      <button class="btn secondary" id="replay">Volver a jugar</button>
    </div>
  `);
  document.getElementById("replay").addEventListener("click", resetGame);
}


function spawnHearts() {
  const total = 28;
  for (let i = 0; i < total; i++) {
    const s = document.createElement("span");
    s.className = "heart";
    s.textContent = "♥";
    s.style.left = Math.floor(Math.random() * 100) + "vw";
    const d = 12 + Math.random() * 16;
    const delay = -Math.random() * d;
    s.style.animationDuration = d + "s";
    s.style.animationDelay = delay + "s";
    s.style.opacity = String(0.6 + Math.random() * 0.4);
    s.style.fontSize = Math.floor(12 + Math.random() * 22) + "px";
    heartsLayer.appendChild(s);
  }
}

spawnHearts();
setProgress(0);
renderInitial();
