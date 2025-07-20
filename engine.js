// engine.js — Núcleo del Campo N
export class CampoNEngine {
    constructor(width = 100, height = 100) {
        this.width = width;
        this.height = height;
        this.campo = this._crearCampo();
    }
    _crearCampo() {
        // Inicializa un array 2D de ceros
        return Array.from({ length: this.height }, () => Array(this.width).fill(0));
    }
    update() {
        // Parámetros DIG
        const alpha = 0.2; // fuerza de flujo de coherencia
        const noise = 0.02; // magnitud del ruido
        const decay = 0.01; // decaimiento hacia 0.5
        const eps = 1e-6; // para evitar log(0)
        let next = this._crearCampo();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // 1. Vecindad Moore 3x3
                let vecinos = [];
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        let ny = y + dy;
                        let nx = x + dx;
                        if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width) {
                            vecinos.push(this.campo[ny][nx]);
                        }
                    }
                }
                // 2. S local (desviación estándar)
                let mean = vecinos.reduce((a,b)=>a+b,0)/vecinos.length;
                let S = Math.sqrt(vecinos.reduce((a,b)=>a+(b-mean)**2,0)/vecinos.length);
                // 3. Energía informacional
                let rho = this.campo[y][x];
                let E = Math.max(eps, S) * rho * Math.log(rho + eps);
                // 4. Gradiente de energía (aprox. diferencia con vecinos)
                let gradE = 0;
                for (let v of vecinos) {
                    let S_v = S; // para simplificar, usamos S local
                    let E_v = Math.max(eps, S_v) * v * Math.log(v + eps);
                    gradE += E_v - E;
                }
                gradE /= vecinos.length;
                // 5. Actualización: flujo + ruido + decaimiento
                let drho = -alpha * gradE + (Math.random()-0.5)*noise + decay*(0.5 - rho);
                let nuevo = rho + drho;
                // Limita entre 0 y 1
                next[y][x] = Math.max(0, Math.min(1, nuevo));
            }
        }
        this.campo = next;
    }
    getCampo() {
        return this.campo;
    }
}
