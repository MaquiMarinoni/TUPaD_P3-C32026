import { Product } from "../types/producto";
import { ICategory } from "../types/categoria";
import { IUser } from "../types/IUser";

// NUEVO: Función auxiliar para obtener usuarios registrados que sobreviven al cambio de página
const obtenerUsuariosLocales = (): IUser[] => {
    return JSON.parse(localStorage.getItem('usuarios_nuevos') || '[]');
};

// ==========================================
// PRODUCTOS (CRUD EN MEMORIA - F6.2)
// ==========================================
export const getProductos = async (): Promise<any[]> => {
    try {
        const res = await fetch('/data/productos.json');
        const base = await res.json();
        const locales = JSON.parse(localStorage.getItem('crud_productos') || '[]');

        // Usamos un Map para fusionar. Si editamos un producto original, el local lo sobrescribe.
        const map = new Map();
        base.forEach((p: any) => map.set(p.id, p));
        locales.forEach((p: any) => map.set(p.id, p));

        // Devolvemos todos los que NO estén eliminados
        return Array.from(map.values()).filter((p: any) => p.eliminado !== true);
    } catch (error) {
        return JSON.parse(localStorage.getItem('crud_productos') || '[]').filter((p: any) => p.eliminado !== true);
    }
};

export const saveProducto = (producto: any) => {
    const locales = JSON.parse(localStorage.getItem('crud_productos') || '[]');
    const index = locales.findIndex((p: any) => p.id === producto.id);
    
    if (index >= 0) locales[index] = producto; // Si existe, lo actualiza (Editar)
    else locales.push(producto); // Si no existe, lo agrega (Nuevo)
    
    localStorage.setItem('crud_productos', JSON.stringify(locales));
};

export const deleteProducto = (id: number) => {
    const locales = JSON.parse(localStorage.getItem('crud_productos') || '[]');
    const index = locales.findIndex((p: any) => p.id === id);
    
    if (index >= 0) {
        locales[index].eliminado = true;
    } else {
        // Si el producto venía del JSON original, lo agregamos a locales como eliminado
        locales.push({ id, eliminado: true });
    }
    
    localStorage.setItem('crud_productos', JSON.stringify(locales));
};

export const getCategorias = async (): Promise<ICategory[]> => {
    const res = await fetch('/data/categorias.json');
    if (!res.ok) throw new Error("No se pudieron cargar las categorías");
    return await res.json();
};

export const getUsuarios = async (): Promise<IUser[]> => {
    try {
        const res = await fetch('/data/usuarios.json');
        if (!res.ok) throw new Error("No se pudo cargar el archivo de usuarios");
        const usuariosJson: IUser[] = await res.json();

        // Combinamos los estáticos con los guardados en LocalStorage
        return [...usuariosJson, ...obtenerUsuariosLocales()];
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return obtenerUsuariosLocales();
    }
};

export const getPedidos = async (): Promise<any[]> => {
    try {
        // 1. Traemos el historial fijo del JSON
        const res = await fetch('/data/pedidos.json');
        const pedidosBase = await res.json();

        // 2. Traemos los pedidos nuevos que hicimos recién en la página
        const pedidosNuevos = JSON.parse(localStorage.getItem('crud_pedidos') || '[]');

        // 3. Juntamos los dos mundos y los devolvemos
        return [...pedidosBase, ...pedidosNuevos];
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        // Si falla el JSON, al menos devolvemos los locales
        return JSON.parse(localStorage.getItem('crud_pedidos') || '[]');
    }
};

// --- LOGICA COMPLEMENTARIA DE AUTENTICACION ---

export const autenticarUsuario = async (email: string, pass: string): Promise<Partial<IUser> | null> => {
    const usuarios = await getUsuarios();

    const usuarioEncontrado = usuarios.find(u =>
        (u.mail === email || (u as any).email === email) &&
        (u.password === pass || (u as any).clave === pass)
    );

    if (usuarioEncontrado) {
        const { password, clave, ...usuarioSinPass } = usuarioEncontrado as any;
        return {
            ...usuarioSinPass,
            mail: usuarioEncontrado.mail || usuarioEncontrado.email,
            rol: String(usuarioEncontrado.rol || usuarioEncontrado.role || "CLIENT").toUpperCase()
        };
    }
    return null;
};

export const registrarUsuarioTemporal = (nuevoUsuario: any): IUser => {
    const user: IUser = {
        ...nuevoUsuario,
        id: Date.now(),
        rol: "CLIENT"
    };

    // Guardamos en LocalStorage en lugar de memoria RAM
    const locales = obtenerUsuariosLocales();
    locales.push(user);
    localStorage.setItem('usuarios_nuevos', JSON.stringify(locales));

    return user;
};