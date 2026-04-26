// Importamos el tipo Rol para usarlo como una pieza de nuestro contrato

import type { Rol } from './Rol'; 

/**
 * INTERFAZ: Es el "contrato" o molde de nuestro usuario.
 * Define qué propiedades son obligatorias y de qué tipo debe ser cada una.
 */
export interface IUser {
    email: string;      // Debe ser siempre una cadena de texto
    role: Rol;           // No es cualquier string, debe ser uno de los definidos en Rol.ts
    loggedIn: boolean; // Estado de la sesión
    password?: string; // El password es opcional en la sesión, pero obligatorio en el registro
}

// Esto evita que accidentalmente guardemos un usuario sin contraseña
// o con datos mezclados, asegurando la integridad de nuestro LocalStorage.