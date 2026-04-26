/**
 * RECORDA: Este es un "Literal Type".
 * A diferencia de un string genérico, aquí restringimos los valores exactos
 * que puede tener un rol en nuestra app.
 */

// ¿Por qué esto? 
// Si mañana escribís "administrador" (con 'or' al final), 
// TS te va a marcar error porque no coincide exactamente con 'admin'.

export type Rol = 'admin' | 'client';