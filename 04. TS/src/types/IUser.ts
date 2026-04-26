// Importamos el tipo Rol para usarlo como una pieza de nuestro contrato

import { Rol } from './Rol';

/**
 * INTERFAZ: Es el "contrato" o molde de nuestro usuario.
 * Define qué propiedades son obligatorias y de qué tipo debe ser cada una.
 */
export interface IUser {
    email: string;      // Debe ser siempre una cadena de texto
    password: string;   // Debe ser siempre una cadena de texto
    rol: Rol;           // No es cualquier string, debe ser uno de los definidos en Rol.ts
}

// Esto evita que accidentalmente guardemos un usuario sin contraseña
// o con datos mezclados, asegurando la integridad de nuestro LocalStorage.