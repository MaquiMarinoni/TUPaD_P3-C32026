import { IUser } from '../../../types/IUser';

// Sincronizamos el ID con el HTML (#registro-form)
const formRegistro = document.querySelector<HTMLFormElement>('#registro-form');

formRegistro?.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    // Extraemos los datos usando FormData
    const formData = new FormData(formRegistro);
    const nombre = formData.get('nombre') as string; // Capturamos el nombre
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validación básica de campos vacíos
    if (!nombre || !email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const nuevoUsuario: IUser = {
        nombre, // Agregamos el nombre al objeto
        email,
        password,
        role: 'client' 
    };

    const dataLow = localStorage.getItem('users');
    const usuarios: IUser[] = dataLow ? JSON.parse(dataLow) : [];

    // VALIDACIÓN: Verificamos si el email ya existe
    if (usuarios.some(u => u.email === email)) {
        alert("¡Error! Este correo ya está registrado.");
        return;
    }

    // GUARDADO
    usuarios.push(nuevoUsuario);
    localStorage.setItem('users', JSON.stringify(usuarios));

    alert("¡Usuario creado con éxito! Redirigiendo al login...");
    window.location.href = '../login/index.html'; 
});