// utils.js — Guardado, exportación, utilidades (esqueleto)
export class UtilsModule {
    static guardar(data, filename = 'export.json') {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }
    static cargar(archivo, callback) {
        const reader = new FileReader();
        reader.onload = (e) => callback(JSON.parse(e.target.result));
        reader.readAsText(archivo);
    }
}
