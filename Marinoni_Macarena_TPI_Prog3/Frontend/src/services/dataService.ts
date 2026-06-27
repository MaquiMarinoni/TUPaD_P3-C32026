import { Product } from "../types/producto";
import { ICategory } from "../types/categoria";
import { IUser } from "../types/IUser";

// NUEVO: Función auxiliar para obtener usuarios registrados que sobreviven al cambio de página
const obtenerUsuariosLocales = (): IUser[] => {
    return JSON.parse(localStorage.getItem('usuarios_nuevos') || '[]');
};

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
    const res = await fetch('/data/pedidos.json');
    if (!res.ok) throw new Error("No se pudieron cargar los pedidos");
    return await res.json();
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