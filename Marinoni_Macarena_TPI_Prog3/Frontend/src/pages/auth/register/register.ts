import { registrarUsuarioTemporal, getUsuarios } from "../../../services/dataService";

const form = document.getElementById("register-form") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputApellido = document.getElementById("apellido") as HTMLInputElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputCelular = document.getElementById("celular") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const emailStr = inputEmail.value.trim();

    // 1. Verificamos si el email ya existe (simulación básica)
    const usuariosActuales = await getUsuarios();
    const existe = usuariosActuales.find(u => u.mail === emailStr || (u as any).email === emailStr);
    
    if (existe) {
        alert("Ya existe una cuenta con este correo electrónico.");
        return;
    }

    // 2. Armamos el nuevo usuario para enviarlo al estado local
    const nuevoUsuario = {
        nombre: inputNombre.value.trim(),
        apellido: inputApellido.value.trim(),
        mail: emailStr,
        celular: inputCelular.value.trim(),
        password: inputPassword.value.trim()
        // El id y el rol los asigna el dataService automáticamente
    };

    // 3. Lo registramos en el estado local (LocalStorage)
    const usuarioRegistrado = registrarUsuarioTemporal(nuevoUsuario);

    // 4. Lo logueamos automáticamente (F4.1)
    const { password, ...usuarioSinPass } = usuarioRegistrado as any;
    
    // Guardamos estrictamente con la clave 'user' para el AuthGuard
    localStorage.setItem('user', JSON.stringify(usuarioSinPass));

    alert(`¡Cuenta creada con éxito! Bienvenido/a ${usuarioRegistrado.nombre}.`);

    // 5. Redireccionamos a la tienda
    window.location.href = "/src/pages/store/home/index.html";
});