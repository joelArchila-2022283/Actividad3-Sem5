import { PersistenciaServicio } from '../services/persistenciaService';
import { LectorUtil } from '../utils/readline';
import { Producto } from '../models/producto';
import { Cliente } from '../models/cliente';

export class MenuPrincipal {
    private productos: Producto[] = [];
    private clientes: Cliente[] = [];

    async iniciar(): Promise<void> {
        console.log("Cargando base de datos JSON...");
        this.productos = await PersistenciaServicio.leerDatos<Producto>('productos.json');
        this.clientes = await PersistenciaServicio.leerDatos<Cliente>('clientes.json');
        
        await this.mostrarMenu();
    }

    private async mostrarMenu(): Promise<void> {
        let salir = false;

        while (!salir) {
            console.log("\n========================================");
            console.log("         SISTEMA DE GESTIÓN               ");
            console.log("========================================");
            console.log("1. Mostrar Productos");
            console.log("2. Agregar Producto");
            console.log("3. Mostrar Clientes");
            console.log("4. Agregar Cliente");
            console.log("5. Salir");
            console.log("========================================");

            const opcion = await LectorUtil.obtenerEntrada("Seleccione una opción: ");

            switch (opcion) {
                case '1':
                    this.mostrarProductos();
                    break;
                case '2':
                    await this.agregarProducto();
                    break;
                case '3':
                    this.mostrarClientes();
                    break;
                case '4':
                    await this.agregarCliente();
                    break;
                case '5':
                    console.log("\n[!] Guardando cambios y cerrando el programa");
                    salir = true;
                    break;
                default:
                    console.log("\n[Error]: Opción no válida. Intente de nuevo.");
            }
        }
    }

    private mostrarProductos(): void {
        console.log("\n--- LISTA DE PRODUCTOS ---");
        if (this.productos.length === 0) {
            console.log("No hay productos registrados.");
            return;
        }
        this.productos.forEach(p => {
            console.log(`ID: ${p.id} | Nombre: ${p.nombre} | Precio: Q${p.precio.toFixed(2)} | Stock: ${p.stock}`);
        });
    }

    private async agregarProducto(): Promise<void> {
        console.log("\n--- REGISTRAR NUEVO PRODUCTO ---");
        const nombre = await LectorUtil.obtenerEntrada("Nombre del producto: ");
        const precioTxt = await LectorUtil.obtenerEntrada("Precio: ");
        const stockTxt = await LectorUtil.obtenerEntrada("Stock: ");

        const precio = parseFloat(precioTxt);
        const stock = parseInt(stockTxt);

        // Validaciones requeridas por la guía
        if (!nombre || isNaN(precio) || isNaN(stock) || precio <= 0 || stock < 0) {
            console.error("[Error]: Datos inválidos. El nombre no puede estar vacío, y los números deben ser mayores a cero.");
            return;
        }

        const nuevoProducto: Producto = {
            id: this.productos.length + 1,
            nombre,
            precio,
            stock
        };

        this.productos.push(nuevoProducto);
        // Persistir inmediatamente en el archivo JSON
        await PersistenciaServicio.guardarDatos<Producto>('productos.json', this.productos);
    }

    private mostrarClientes(): void {
        console.log("\n--- LISTA DE CLIENTES ---");
        if (this.clientes.length === 0) {
            console.log("No hay clientes registrados.");
            return;
        }
        this.clientes.forEach(c => {
            console.log(`ID: ${c.id} | Nombre: ${c.nombreCompleto} | Correo: ${c.correo} | Estado: ${c.activo ? 'Activo' : 'Inactivo'}`);
        });
    }

    private async agregarCliente(): Promise<void> {
        console.log("\n--- REGISTRAR NUEVO CLIENTE ---");
        const nombreCompleto = await LectorUtil.obtenerEntrada("Nombre completo: ");
        const correo = await LectorUtil.obtenerEntrada("Correo electrónico: ");

        // Validaciones
        if (!nombreCompleto || !correo || !correo.includes('@')) {
            console.error("[Error]: Datos del cliente inválidos. Verifique el nombre y el correo.");
            return;
        }

        const nuevoCliente: Cliente = {
            id: this.clientes.length + 1,
            nombreCompleto,
            correo,
            activo: true
        };

        this.clientes.push(nuevoCliente);
        // Persistir inmediatamente en el archivo JSON
        await PersistenciaServicio.guardarDatos<Cliente>('clientes.json', this.clientes);
    }
}