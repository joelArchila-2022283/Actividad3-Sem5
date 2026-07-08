import { MenuPrincipal } from './menuPrincipal/menu';

async function main() {
    const app = new MenuPrincipal();
    await app.iniciar();
}

main();