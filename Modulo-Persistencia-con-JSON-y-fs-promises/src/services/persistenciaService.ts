import * as fs from 'fs/promises';
import * as path from 'path';

export class PersistenciaServicio {
    
    static async guardarDatos<T>(nombreArchivo: string, datos: T[]): Promise<boolean> {
        try {
            const rutaCarpeta = path.join(__dirname, '../data');
            const rutaArchivo = path.join(rutaCarpeta, nombreArchivo);
            
            await fs.mkdir(rutaCarpeta, { recursive: true });
            
            if (!datos || datos.length === 0) {
                console.warn(`[Advertencia]: Se intentó guardar un arreglo vacío en ${nombreArchivo}.`);
            }

            const contenidoJson = JSON.stringify(datos, null, 2);
            await fs.writeFile(rutaArchivo, contenidoJson, 'utf-8');
            console.log(`[Éxito]: Datos guardados correctamente en ${nombreArchivo}.`);
            return true;
        } catch (error: any) {
            console.error(`[Error al escribir en ${nombreArchivo}]:`, error.message);
            return false;
        }
    }

    static async leerDatos<T>(nombreArchivo: string): Promise<T[]> {
        const rutaArchivo = path.join(__dirname, '../data', nombreArchivo);
        try {
            const contenido = await fs.readFile(rutaArchivo, 'utf-8');
            
            if (!contenido.trim()) {
                console.warn(`[Advertencia]: El archivo ${nombreArchivo} está vacío.`);
                return [];
            }

            const datosParseados: T[] = JSON.parse(contenido);
            return datosParseados;
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.error(`[Error]: El archivo ${nombreArchivo} no existe. Retornando arreglo vacío.`);
                return [];
            }
            if (error instanceof SyntaxError) {
                console.error(`[Error]: El archivo ${nombreArchivo} contiene datos corruptos (JSON inválido).`);
                return [];
            }
            console.error(`[Error inesperado al leer ${nombreArchivo}]:`, error.message);
            return [];
        }
    }
}