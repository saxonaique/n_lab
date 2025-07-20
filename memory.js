// memory.js — Memoria y reconocimiento (esqueleto)
export class MemoryModule {
    constructor() {
        this.patrones = [];
    }
    almacenarPatron(patron) {
        this.patrones.push(patron);
    }
    medirSimilitud(patron) {
        // Calcula la similitud máxima entre el patrón dado y los almacenados
        // Similitud: correlación normalizada (coseno)
        let maxSim = 0;
        for (const p of this.patrones) {
            if (p.length !== patron.length || p[0].length !== patron[0].length) continue;
            let dot = 0, normA = 0, normB = 0;
            for (let y = 0; y < p.length; y++) {
                for (let x = 0; x < p[0].length; x++) {
                    dot += p[y][x] * patron[y][x];
                    normA += p[y][x] ** 2;
                    normB += patron[y][x] ** 2;
                }
            }
            if (normA > 0 && normB > 0) {
                let sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));
                if (sim > maxSim) maxSim = sim;
            }
        }
        return maxSim;
    }
    reconocer(patron, umbral = 0.8) {
        // Devuelve índice y similitud máxima si algún patrón supera el umbral
        let best = {idx: -1, sim: 0};
        for (let i = 0; i < this.patrones.length; i++) {
            let p = this.patrones[i];
            if (p.length !== patron.length || p[0].length !== patron[0].length) continue;
            let dot = 0, normA = 0, normB = 0;
            for (let y = 0; y < p.length; y++) {
                for (let x = 0; x < p[0].length; x++) {
                    dot += p[y][x] * patron[y][x];
                    normA += p[y][x] ** 2;
                    normB += patron[y][x] ** 2;
                }
            }
            if (normA > 0 && normB > 0) {
                let sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));
                if (sim > best.sim) best = {idx: i, sim};
            }
        }
        return best.sim >= umbral ? best : null;
    }
}
