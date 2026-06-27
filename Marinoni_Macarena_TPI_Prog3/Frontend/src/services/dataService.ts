import { Product } from "../types/producto";
import { ICategory } from "../types/categoria";

// F4.1: Estado local en memoria para almacenar usuarios registrados de forma temporal
let usuariosNuevosLocales: any[] = [];

export const getProductos = async (): Promise<Product[]> => {
    const res = await fetch('/data/productos.json');
    if (!res.ok) throw new Error("No se pudieron cargar los productos");
    return await res.json();
};

export const getCategorias = async (): Promise<ICategory[]> => {
    const res = await fetch('/data/categorias.json');
    if (!res.ok) throw new Error("No se pudieron cargar las categorías");
    return await res.json();
};

export const getUsuarios = async (): Promise<any[]> => {
    try {
        const res = await fetch('/data/usuarios.json');
        if (!res.ok) throw new Error("No se pudo cargar el archivo de usuarios");
        const usuariosJson = await res.json();
        
        // Combinamos los usuarios estáticos del JSON con los registrados temporalmente en la sesión
        return [...usuariosJson, ...usuariosNuevosLocales];
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        // Si el fetch falla (ej. error de red o de json), al menos devolvemos los registrados localmente
        return [...usuariosNuevosLocales];
    }
};

export const getPedidos = async (): Promise<any[]> => {
    const res = await fetch('/data/pedidos.json');
    if (!res.ok) throw new Error("No se pudieron cargar los pedidos");
    return await res.json();
};

// --- LOGICA COMPLEMENTARIA DE AUTENTICACION (F4.1) ---

/**
 * Valida las credenciales ingresadas contra la lista unificada de usuarios.
 * Retorna el usuario sin la contraseña si es válido, o null si falla.
 */
export const autenticarUsuario = async (email: string, pass: string): Promise<any | null> => {
    const usuarios = await getUsuarios();
    
    // Buscamos coincidencia por mail y contraseña
    const usuarioEncontrado = usuarios.find(u => u.mail === email && u.password === pass);
    
    if (usuarioEncontrado) {
        // F4.1: Extraemos el password para cumplir la regla de no persistirlo en localStorage
        const { password, ...usuarioSinPass } = usuarioEncontrado;
        return usuarioSinPass;
    }
    return null;
};

/**
 * F4.1: Agrega un nuevo usuario al estado local en memoria (no persiste en el JSON)
 */
export const registrarUsuarioTemporal = (nuevoUsuario: any): any => {
    const user = {
        ...nuevoUsuario,
        id: Date.now(), // ID incremental provisorio basado en timestamp
        rol: "USUARIO"  // Por defecto, los registros nuevos adoptan el rol de cliente
    };
    usuariosNuevosLocales.push(user);
    return user;
};