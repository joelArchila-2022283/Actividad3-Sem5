import { PersistenciaServicio } from './services/persistenciaService';
import { Producto } from './models/producto';
import { Cliente } from './models/cliente';

async function ejecutarPruebas() {
    console.log("--- Iniciando Pruebas de Persistencia ---\n");

    // 1. Datos de prueba válidos
    const listaProductos: Producto[] = [
        { id: 1, nombre: "Cuaderno Kinal", precio: 15.50, stock: 100 },
        { id: 2, nombre: "Lapicero Azul", precio: 3.00, stock: 250 }
    ];

    const listaClientes: Cliente[] = [
        { id: 1, nombreCompleto: "Joel Archila", correo: "joel@correo.com", activo: true }
    ];

    // 2. Probar Escritura Correcta
    console.log("Guardando datos válidos...");
    await PersistenciaServicio.guardarDatos<Producto>('productos.json', listaProductos);
    await PersistenciaServicio.guardarDatos<Cliente>('clientes.json', listaClientes);

    // 3. Probar Lectura Correcta y Reconstrucción
    console.log("\nLeyendo datos guardados...");
    const productosCargados = await PersistenciaServicio.leerDatos<Producto>('productos.json');
    console.log("Productos en memoria:", productosCargados);

    // 4. Probar Escenario de Error: Archivo Inexistente
    console.log("\nProbando lectura de un archivo que no existe...");
    const archivoFantasma = await PersistenciaServicio.leerDatos<any>('usuarios_fantasmas.json');
    console.log("Resultado de archivo inexistente (debe ser []):", archivoFantasma);
}

ejecutarPruebas();