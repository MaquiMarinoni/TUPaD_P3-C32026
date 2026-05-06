
import { IUser } from "../types/IUser";

// Función para obtener usuarios (para el registro/login)
export const getUsers = (): IUser[] => {
    const usersRaw = localStorage.getItem("users");
    return usersRaw ? JSON.parse(usersRaw) : [];
};

// Función para guardar usuarios
export const saveUsers = (users: IUser[]): void => {
    localStorage.setItem("users", JSON.stringify(users));
};

// Función para obtener el usuario logueado
export const getLoggedUser = (): IUser | null => {
    const userRaw = localStorage.getItem("userData");
    return userRaw ? JSON.parse(userRaw) : null;
};

// Función para guardar el usuario logueado
export const saveLoggedUser = (user: IUser): void => {
    localStorage.setItem("userData", JSON.stringify(user));
};

// Función para cerrar sesión
export const clearLoggedUser = (): void => {
    localStorage.removeItem("userData");
};