// interface.js — Visualizador y UI (esqueleto)
window.addEventListener('DOMContentLoaded', () => {
    // --- Parámetros básicos ---
    const canvas = document.getElementById('campoNCanvas');
    const ctx = canvas.getContext('2d');
    const controls = document.getElementById('controls');
    controls.innerHTML = `
      <button id="injectNoise">Inyectar Ruido</button>
      <button id="resetField">Reiniciar Campo</button>
    `;
    const injectNoiseBtn = document.getElementById('injectNoise');
    const resetFieldBtn = document.getElementById('resetField');
    const dim = 50;
    const cellSize = canvas.width / dim;
    let field = [];
    let drawing = false;
    let brushSize = 3;
    
    

    function initField() {
      for (let r = 0; r < dim; r++) {
        field[r] = [];
        for (let c = 0; c < dim; c++) {
          field[r][c] = 0.5 + (Math.random() - 0.5) * 0.2;
        }
      }
    }

    function drawField() {
      for (let y = 0; y < dim; y++) {
        for (let x = 0; x < dim; x++) {
          let v = Math.max(0, Math.min(1, field[y][x]));
          ctx.fillStyle = `rgb(${Math.floor(255*v)},${Math.floor(255*v)},${Math.floor(255*v)})`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    function injectAt(e) {
      const rect = canvas.getBoundingClientRect();
      const cx = Math.floor((e.clientX - rect.left) * dim / canvas.width);
      const cy = Math.floor((e.clientY - rect.top) * dim / canvas.height);
      let half = Math.floor(brushSize/2);
      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          let x = cx + dx;
          let y = cy + dy;
          if (x >= 0 && x < dim && y >= 0 && y < dim) {
            field[y][x] = 1.0;
          }
        }
      }
      drawField();
    }

    // --- Listeners ---
    injectNoiseBtn.onclick = () => {
      for (let y = 0; y < dim; y++)
        for (let x = 0; x < dim; x++)
          field[y][x] = Math.random();
      drawField();
    };
    resetFieldBtn.onclick = () => {
      initField();
      drawField();
    };
    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      injectAt(e);
    });
    canvas.addEventListener('mouseup', () => { drawing = false; });
    canvas.addEventListener('mouseleave', () => { drawing = false; });
    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      injectAt(e);
    });

    // --- Inicializar y dibujar ---
    initField();
    drawField();

    function updateField() {
      // Ejemplo: difunde y añade ruido
      let next = [];
      for (let y = 0; y < dim; y++) {
        next[y] = [];
        for (let x = 0; x < dim; x++) {
          // Promedio con vecinos + ruido
          let sum = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              let ny = y + dy, nx = x + dx;
              if (ny >= 0 && ny < dim && nx >= 0 && nx < dim) {
                sum += field[ny][nx];
                count++;
              }
            }
          }
          let avg = sum / count;
          next[y][x] = 0.95 * avg + 0.05 * Math.random();
        }
      }
      field = next;
    }

    function loop() {
      updateField();
      drawField();
      requestAnimationFrame(loop);
    }
    loop();

    // --- Inicialización de canvas y motor ---
    
    
    
    
    controls.innerHTML = `
      <button id="pauseBtn">⏸️ Pausa</button>
      <button id="resetBtn">🔄 Reiniciar</button>
      <button id="noiseBtn">🌪️ Inyectar Ruido</button>
      <button id="mouseInjectBtn">🖱️ Inyectar con Ratón</button>
    `;
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const noiseBtn = document.getElementById('noiseBtn');
    const mouseInjectBtn = document.getElementById('mouseInjectBtn');
    const vizSel = document.getElementById('vizMode');
    let running = true;
    let mouseInjectActive = false;
    
    
    

    // --- Listeners de botones ---
    pauseBtn.onclick = () => {
        running = !running;
        pauseBtn.textContent = running ? '⏸️ Pausa' : '▶️ Reanudar';
        if (running) render();
    };
    resetBtn.onclick = () => {
        engine.campo = engine._crearCampo();
    };
    noiseBtn.onclick = () => {
        for (let y = 0; y < dim; y++)
            for (let x = 0; x < dim; x++)
                engine.campo[y][x] = Math.random();
    };
    mouseInjectBtn.onclick = () => {
        mouseInjectActive = !mouseInjectActive;
        mouseInjectBtn.textContent = mouseInjectActive ? '🖱️ Inyección ACTIVADA' : '🖱️ Inyectar con Ratón';
        canvas.style.cursor = mouseInjectActive ? 'crosshair' : 'default';
    };

    // --- Lógica de pincel con ratón ---
    canvas.addEventListener('mousedown', (e) => {
        if (!mouseInjectActive) return;
        drawing = true;
        injectAt(e);
    });
    canvas.addEventListener('mouseup', () => { drawing = false; });
    canvas.addEventListener('mouseleave', () => { drawing = false; });
    canvas.addEventListener('mousemove', (e) => {
        if (!mouseInjectActive || !drawing) return;
        injectAt(e);
    });
    function injectAt(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = Math.floor((e.clientX - rect.left) * dim / canvas.width);
        const cy = Math.floor((e.clientY - rect.top) * dim / canvas.height);
        let half = 1; // pincel 3x3
        for (let dy = -half; dy <= half; dy++) {
            for (let dx = -half; dx <= half; dx++) {
                let x = cx + dx;
                let y = cy + dy;
                if (x >= 0 && x < dim && y >= 0 && y < dim) {
                    engine.campo[y][x] = 1.0;
                }
            }
        }
    }

    // --- Parámetros DIG UI ---
    
    
    
    
    
    
    
    
    
    paramAlpha.oninput = () => { alpha = parseFloat(paramAlpha.value); valAlpha.textContent = alpha.toFixed(2); };
    paramNoise.oninput = () => { noise = parseFloat(paramNoise.value); valNoise.textContent = noise.toFixed(2); };
    paramDecay.oninput = () => { decay = parseFloat(paramDecay.value); valDecay.textContent = decay.toFixed(2); };
    vizSel.onchange = () => { vizMode = vizSel.value; };

    // --- Render principal ---
    function render() {
        // Siempre dibuja el campo, aunque esté pausado
        if (running) {
            engine.setParams(alpha, noise, decay);
            engine.update();
        }
        // Aquí iría el código de pintado del campo en el canvas (ctx)
        // ...
        // Si running, animar
        if (running) requestAnimationFrame(render);
    }
    render();

    
    
    

    // --- Botones de simulación ---
    // --- Botones de simulación ÚNICOS ---
    
    controls.innerHTML = `
      <button id="pauseBtn">⏸️ Pausa</button>
      <button id="resetBtn">🔄 Reiniciar</button>
      <button id="noiseBtn">🌪️ Inyectar Ruido</button>
      <button id="mouseInjectBtn">🖱️ Inyectar con Ratón</button>
    `;
    
    
    
    
    
    
    

    
    
    
    // Variables de control únicas
    
    
    pauseBtn.onclick = () => {
        running = !running;
        pauseBtn.textContent = running ? '⏸️ Pausa' : '▶️ Reanudar';
        if (running) render();
    };
    resetBtn.onclick = () => {
        engine.campo = engine._crearCampo();
    };
    noiseBtn.onclick = () => {
        // Inyectar ruido en todo el campo
        for (let y = 0; y < dim; y++)
            for (let x = 0; x < dim; x++)
                engine.campo[y][x] = Math.random();
    };
    mouseInjectBtn.onclick = () => {
        mouseInjectActive = !mouseInjectActive;
        mouseInjectBtn.textContent = mouseInjectActive ? '🖱️ Inyección ACTIVADA' : '🖱️ Inyectar con Ratón';
        canvas.style.cursor = mouseInjectActive ? 'crosshair' : 'default';
    };
    // Lógica de inyección con ratón tipo pincel única
    canvas.addEventListener('mousedown', (e) => {
        if (!mouseInjectActive) return;
        drawing = true;
        injectAt(e);
    });
    canvas.addEventListener('mouseup', () => { drawing = false; });
    canvas.addEventListener('mouseleave', () => { drawing = false; });
    canvas.addEventListener('mousemove', (e) => {
        if (!mouseInjectActive || !drawing) return;
        injectAt(e);
    });
    function injectAt(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = Math.floor((e.clientX - rect.left) * dim / canvas.width);
        const cy = Math.floor((e.clientY - rect.top) * dim / canvas.height);
        let half = 1; // tamaño pincel fijo 3x3
        for (let dy = -half; dy <= half; dy++) {
            for (let dx = -half; dx <= half; dx++) {
                let x = cx + dx;
                let y = cy + dy;
                if (x >= 0 && x < dim && y >= 0 && y < dim) {
                    engine.campo[y][x] = 1.0;
                }
            }
        }
    }

    // --- Parámetros DIG UI ---
    
    
    
    
    
    
    
    
    

    paramAlpha.oninput = () => { alpha = parseFloat(paramAlpha.value); valAlpha.textContent = alpha.toFixed(2); };
    paramNoise.oninput = () => { noise = parseFloat(paramNoise.value); valNoise.textContent = noise.toFixed(2); };
    paramDecay.oninput = () => { decay = parseFloat(paramDecay.value); valDecay.textContent = decay.toFixed(2); };
    vizSel.onchange = () => { vizMode = vizSel.value; };

    // --- Sobreescribir parámetros en engine ---
    engine.setParams = (a, n, d) => { engine._alpha = a; engine._noise = n; engine._decay = d; };
    engine.setParams(alpha, noise, decay);
    // Hook para update con parámetros
    const oldUpdate = engine.update.bind(engine);
    engine.update = function() { this.setParams(alpha, noise, decay); oldUpdate(); };


    // --- Controles UI ---
    // (Eliminado: declaración duplicada y bloque de controles, solo se mantiene el bloque de la línea 11-17 al inicio del archivo)

    
    
    
    
    const brushSizeSel = document.getElementById('brushSize');
    const brushIntensity = document.getElementById('brushIntensity');
    const brushColor = document.getElementById('brushColor');
    const brushErase = document.getElementById('brushErase');
    const brushEffect = document.getElementById('brushEffect');

    
    
    
    let brushVal = 1;
    let eraseMode = false;
    let colorMode = '#ffffff';
    let effect = 'normal';

    brushSizeSel.onchange = () => brushSize = parseInt(brushSizeSel.value);
    brushIntensity.oninput = () => brushVal = parseFloat(brushIntensity.value);
    brushColor.oninput = () => colorMode = brushColor.value;
    brushErase.onchange = () => eraseMode = brushErase.checked;
    brushEffect.onchange = () => effect = brushEffect.value;


    pauseBtn.onclick = () => {
        running = !running;
        pauseBtn.textContent = running ? '⏸️ Pausa' : '▶️ Reanudar';
        if (running) render();
    };
    resetBtn.onclick = () => {
        engine.campo = engine._crearCampo();
    };
    noiseBtn.onclick = () => {
        engine.update();
    };

    mouseInjectBtn.onclick = () => {
        mouseInjectActive = !mouseInjectActive;
        mouseInjectBtn.textContent = mouseInjectActive ? '🖱️ Inyección ACTIVADA' : '🖱️ Inyectar con Ratón';
        canvas.style.cursor = mouseInjectActive ? 'crosshair' : 'default';
    };

    canvas.addEventListener('mousedown', (e) => {
        if (!mouseInjectActive) return;
        drawing = true;
        injectAt(e);
    });
    canvas.addEventListener('mouseup', () => {
        drawing = false;
    });
    canvas.addEventListener('mouseleave', () => {
        drawing = false;
    });
    canvas.addEventListener('mousemove', (e) => {
        if (!mouseInjectActive || !drawing) return;
        injectAt(e);
    });

    function injectAt(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = Math.floor((e.clientX - rect.left) * dim / canvas.width);
        const cy = Math.floor((e.clientY - rect.top) * dim / canvas.height);
        let half = Math.floor(brushSize/2);
        for (let dy = -half; dy <= half; dy++) {
            for (let dx = -half; dx <= half; dx++) {
                let x = cx + dx;
                let y = cy + dy;
                if (x >= 0 && x < dim && y >= 0 && y < dim) {
                    field[y][x] = 1.0;
                }
            }
        }
    }

    // --- Gráfico de información total ---
    // Gráficos y valores separados
    const energyGraph = document.getElementById('energyGraph');
    const cohGraph = document.getElementById('cohGraph');
    const entGraph = document.getElementById('entGraph');
    const infoVal = document.getElementById('infoVal');
    const cohVal = document.getElementById('cohVal');
    const entVal = document.getElementById('entVal');
    // Etiquetas escala
    let energyMinLabel = document.createElement('span');
    let energyMaxLabel = document.createElement('span');
    let cohMinLabel = document.createElement('span');
    let cohMaxLabel = document.createElement('span');
    let entMinLabel = document.createElement('span');
    let entMaxLabel = document.createElement('span');
    energyMinLabel.className = energyMaxLabel.className = 'text-[10px] text-gray-400';
    cohMinLabel.className = cohMaxLabel.className = 'text-[10px] text-gray-400';
    entMinLabel.className = entMaxLabel.className = 'text-[10px] text-gray-400';
    energyGraph.parentNode.insertBefore(energyMinLabel, energyGraph);
    energyGraph.parentNode.insertBefore(energyMaxLabel, energyGraph.nextSibling);
    cohGraph.parentNode.insertBefore(cohMinLabel, cohGraph);
    cohGraph.parentNode.insertBefore(cohMaxLabel, cohGraph.nextSibling);
    entGraph.parentNode.insertBefore(entMinLabel, entGraph);
    entGraph.parentNode.insertBefore(entMaxLabel, entGraph.nextSibling);

// --- Controles de memoria ---
const memory = new MemoryModule();
    // UI: panel memoria
    let memPanel = document.createElement('div');
    memPanel.className = 'bg-gray-900 p-2 rounded flex flex-col gap-2 mt-4';
    memPanel.innerHTML = `<span class="text-xs font-semibold mb-1">Memoria</span>
      <button id="saveMemory" class="bg-green-700 hover:bg-green-800 text-xs rounded px-2 py-1">Guardar memoria</button>
      <span id="memSimil" class="text-xs">Similitud: 0.00</span>
      <span id="memRecog" class="text-xs">Reconocimiento: -</span>
      <div id="memThumbs" class="flex flex-wrap gap-1"></div>`;
    document.getElementById('paramPanel').appendChild(memPanel);
    const saveMemoryBtn = memPanel.querySelector('#saveMemory');
    const memSimil = memPanel.querySelector('#memSimil');
    const memRecog = memPanel.querySelector('#memRecog');
    const memThumbs = memPanel.querySelector('#memThumbs');

    function getCurrentFieldCopy() {
      // Devuelve copia profunda del campo actual
      let arr = [];
      for (let y = 0; y < dim; y++) {
        arr[y] = [];
        for (let x = 0; x < dim; x++) {
          arr[y][x] = engine.campo[y][x];
        }
      }
      return arr;
    }
    saveMemoryBtn.onclick = () => {
      memory.almacenarPatron(getCurrentFieldCopy());
      updateMemThumbs();
    };
    function updateMemThumbs() {
      memThumbs.innerHTML = '';
      memory.patrones.forEach((p,i) => {
        let cnv = document.createElement('canvas');
        cnv.width = 24; cnv.height = 24;
        let ctx = cnv.getContext('2d');
        for(let y=0;y<p.length;y++) for(let x=0;x<p[0].length;x++){
          let v = Math.floor(255*p[y][x]);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x*24/p[0].length, y*24/p.length, 24/p[0].length, 24/p.length);
        }
        cnv.title = `Memoria #${i+1}`;
        memThumbs.appendChild(cnv);
      });
    }

    // Actualización en tiempo real de similitud y reconocimiento
    function updateMemoryStatus() {
      const field = getCurrentFieldCopy();
      let sim = memory.medirSimilitud(field);
      let recog = memory.reconocer(field, 0.8);
      memSimil.textContent = `Similitud: ${sim.toFixed(3)}`;
      if (recog && recog.idx !== -1) {
        memRecog.textContent = `Reconocimiento: #${recog.idx+1} (${recog.sim.toFixed(3)})`;
      } else {
        memRecog.textContent = 'Reconocimiento: -';
      }
    const egctx = energyGraph.getContext('2d');
    const cgctx = cohGraph.getContext('2d');
    const hgctx = entGraph.getContext('2d');
}
// Variables de historial de gráficos fuera de render para evitar problemas de scope
let infoHistory = [];
let cohHistory = [];
let entHistory = [];

function render() {
    // Siempre dibuja el campo, aunque esté pausado
    if (running) {
        engine.setParams(alpha, noise, decay);
        engine.update();
    }
    const campo = engine.getCampo();
        // Precalcular S y E si hace falta
        let Smap = [], Emap = [];
        let energySum = 0;
        let cohSum = 0;
        let entSum = 0;
        let totalCells = dim * dim;
        for (let y = 0; y < dim; y++) {
            Smap[y] = [];
            Emap[y] = [];
            for (let x = 0; x < dim; x++) {
                let vecinos = [];
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        let ny = y + dy;
                        let nx = x + dx;
                        if (ny >= 0 && ny < dim && nx >= 0 && nx < dim) {
                            vecinos.push(campo[ny][nx]);
                        }
                    }
                }
                let mean = vecinos.reduce((a,b)=>a+b,0)/vecinos.length;
                let S = Math.sqrt(vecinos.reduce((a,b)=>a+(b-mean)**2,0)/vecinos.length);
                Smap[y][x] = S;
                let rho = campo[y][x];
                let eps = 1e-6;
                let E = Math.max(eps, S) * rho * Math.log(rho+eps);
                Emap[y][x] = E;
                energySum += E;
                cohSum += S;
                entSum += -rho * Math.log(rho+eps);
            }
        }
        // --- Render campo principal ---
        for (let y = 0; y < dim; y++) {
            for (let x = 0; x < dim; x++) {
                let v = campo[y][x];
                let color = '';
                if (vizMode === 'campo') {
                    color = `rgb(${v*255},${v*255},${v*255})`;
                } else if (vizMode === 'coherencia') {
                    let s = Smap[y][x];
                    let c = Math.floor(255 * s / 0.5); // escala S a [0,255]
                    color = `rgb(${c},${0},${255-c})`;
                } else if (vizMode === 'energia') {
                    let e = Emap[y][x];
                    let ce = Math.floor(255 * (e+0.2)/0.4); // escala E a [0,255] (ajustado)
                    color = `rgb(${ce},${255-ce},0)`;
                }
                ctx.fillStyle = color;
                ctx.fillRect(x * (canvas.width/dim), y * (canvas.height/dim),
                    (canvas.width/dim), (canvas.height/dim));
            }
        }
        // --- Actualiza gráficos y valores individuales ---
        let avgEnergy = energySum / totalCells;
        let avgCoh = cohSum / totalCells;
        let avgEnt = entSum / totalCells;
        infoHistory.push(avgEnergy);
        cohHistory.push(avgCoh);
        entHistory.push(avgEnt);
        if (infoHistory.length > energyGraph.width) infoHistory.shift();
        if (cohHistory.length > cohGraph.width) cohHistory.shift();
        if (entHistory.length > entGraph.width) entHistory.shift();
        // Energía
        egctx.clearRect(0,0,energyGraph.width,energyGraph.height);
        let minE = Math.min(...infoHistory), maxE = Math.max(...infoHistory);
        if (minE === maxE) { minE -= 0.01; maxE += 0.01; }
        egctx.beginPath();
        for(let i=0; i<infoHistory.length; i++){
            let y = energyGraph.height - ((infoHistory[i]-minE)/(maxE-minE))*energyGraph.height;
            if(i===0) egctx.moveTo(i,y);
            else egctx.lineTo(i,y);
        }
        egctx.strokeStyle = '#00ff99';
        egctx.lineWidth = 2;
        egctx.stroke();
        // Línea guía valor actual
        let yE = energyGraph.height - ((avgEnergy-minE)/(maxE-minE))*energyGraph.height;
        egctx.strokeStyle = 'rgba(0,255,153,0.3)';
        egctx.beginPath();
        egctx.moveTo(0, yE); egctx.lineTo(energyGraph.width, yE); egctx.stroke();
        // Etiquetas min/max
        energyMinLabel.textContent = minE.toFixed(2);
        energyMaxLabel.textContent = maxE.toFixed(2);
        infoVal.textContent = `E: ${avgEnergy.toFixed(4)}`;
        // Coherencia
        cgctx.clearRect(0,0,cohGraph.width,cohGraph.height);
        let minC = Math.min(...cohHistory), maxC = Math.max(...cohHistory);
        if (minC === maxC) { minC -= 0.01; maxC += 0.01; }
        cgctx.beginPath();
        for(let i=0; i<cohHistory.length; i++){
            let y = cohGraph.height - ((cohHistory[i]-minC)/(maxC-minC))*cohGraph.height;
            if(i===0) cgctx.moveTo(i,y);
            else cgctx.lineTo(i,y);
        }
        cgctx.strokeStyle = '#3fa7ff';
        cgctx.lineWidth = 2;
        cgctx.stroke();
        // Línea guía valor actual
        let yC = cohGraph.height - ((avgCoh-minC)/(maxC-minC))*cohGraph.height;
        cgctx.strokeStyle = 'rgba(63,167,255,0.3)';
        cgctx.beginPath();
        cgctx.moveTo(0, yC); cgctx.lineTo(cohGraph.width, yC); cgctx.stroke();
        cohMinLabel.textContent = minC.toFixed(2);
        cohMaxLabel.textContent = maxC.toFixed(2);
        cohVal.textContent = `C: ${avgCoh.toFixed(4)}`;
        // Entropía
        hgctx.clearRect(0,0,entGraph.width,entGraph.height);
        let minH = Math.min(...entHistory), maxH = Math.max(...entHistory);
        if (minH === maxH) { minH -= 0.01; maxH += 0.01; }
        hgctx.beginPath();
        for(let i=0; i<entHistory.length; i++){
            let y = entGraph.height - ((entHistory[i]-minH)/(maxH-minH))*entGraph.height;
            if(i===0) hgctx.moveTo(i,y);
            else hgctx.lineTo(i,y);
        }
        hgctx.strokeStyle = '#ffd93f';
        hgctx.lineWidth = 2;
        hgctx.stroke();
        // Línea guía valor actual
        let yH = entGraph.height - ((avgEnt-minH)/(maxH-minH))*entGraph.height;
        hgctx.strokeStyle = 'rgba(255,217,63,0.3)';
        hgctx.beginPath();
        hgctx.moveTo(0, yH); hgctx.lineTo(entGraph.width, yH); hgctx.stroke();
        entMinLabel.textContent = minH.toFixed(2);
        entMaxLabel.textContent = maxH.toFixed(2);
        entVal.textContent = `H: ${avgEnt.toFixed(4)}`;

        updateMemoryStatus();
        requestAnimationFrame(render);
}
// Llama siempre a render, incluso si está pausado
render();
});
