import { IUser } from '../../../types/IUser';

// Seleccionamos el formulario usando un GENÉRICO <HTMLFormElement>
// Esto nos da autocompletado para métodos como 'submit' o 'reset'.
const formRegistro = document.querySelector<HTMLFormElement>('#form-registro');

/**
 * LÓGICA DE REGISTRO
 * Escuchamos el evento submit para procesar los datos antes de que la página se recargue.
 */
formRegistro?.addEventListener('submit', (e: Event) => {
    // 1. Frenamos el comportamiento por defecto del navegador (recarga de página)
    e.preventDefault();

    // 2. Extraemos los datos usando FormData (más limpio que usar IDs uno por uno)
    const formData = new FormData(formRegistro);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 3. Creamos el objeto siguiendo el molde de la Interfaz IUser
    const nuevoUsuario: IUser = {
        email,
        password,
        role: 'client' // Todos los registros nuevos arrancan como clientes
    };

    /**
     * PERSISTENCIA EN LOCALSTORAGE
     * Recordá: LocalStorage solo guarda TEXTO (strings).
     */
    const dataLow = localStorage.getItem('users');
    
    // Si hay datos, los convertimos de texto a objeto (JSON.parse). Si no, creamos un array vacío.
    const usuarios: IUser[] = dataLow ? JSON.parse(dataLow) : [];

    // 4. VALIDACIÓN: Verificamos si el email ya existe en el array
    if (usuarios.some(u => u.email === email)) {
        alert("¡Error! Este correo ya está registrado.");
        return; // Cortamos la ejecución si ya existe
    }

    // 5. GUARDADO: Agregamos el usuario al array y lo volvemos a convertir a texto (JSON.stringify)
    usuarios.push(nuevoUsuario);
    localStorage.setItem('users', JSON.stringify(usuarios));

    alert("Usuario creado con éxito. Redirigiendo al login...");
    window.location.href = '../login/index.html'; 
});