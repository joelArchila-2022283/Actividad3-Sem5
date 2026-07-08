import * as readline from 'readline';

export class LectorUtil {
    
    static obtenerEntrada(pregunta: string): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question(pregunta, (respuesta) => {
                rl.close();
                resolve(respuesta.trim());
            });
        });
    }
}