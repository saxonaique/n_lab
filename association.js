// association.js — Asociación y secuencias (esqueleto)
export class AssociationModule {
    constructor() {
        this.asociaciones = {};
    }
    asociar(a, b) {
        this.asociaciones[a] = b;
    }
    anticipar(a) {
        return this.asociaciones[a] || null;
    }
}
