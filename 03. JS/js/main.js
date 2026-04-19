// ------------------------------------------------------------------------------------------------

// Esto es el elemento del HTML (usando su ID). es el elemento del HTML donde irán las categorias
// Es como un buscador. Le indicamos el ID que pusimos en el HTML y trae ese elemento para trabajarlo desde JS

// SELECCION DE ELEMENTOS
const contenedorCategorias = document.getElementById("lista-categorias");
const contenedorProductos = document.getElementById("contenedor-productos");

// ------------------------------------------------------------------------------------------------

// FUNCION PARA CARGAR LAS CATEGORIAS 

// se crea la función para cargar las categorías 
const cargarCategorias = () => {
    // con forEach se recorre el array de categorías definido en data.js
    categorias.forEach(nombreCategoria => {
        // Por cada categoría, se crea un nuevo elemento de lista <li> 
        const li = document.createElement("li");
        // se usa Template Strings (comillas invertidas) para meter el link con el nombre de la categoría y se le asigna un ID o clase para poder hacerle clic
        li.innerHTML = `<a href="#" class="enlace-categoria">${nombreCategoria}</a>`;
        // se "escucha" el clic en ese link
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault(); // Evita que la página salte al inicio 
            filtrarProductos(nombreCategoria); // Llama a la función de filtro
        });
        // se mete el elemento creado en el HTML (el <li> dentro del <ul> padre)
        contenedorCategorias.appendChild(li);
    });
};

// ------------------------------------------------------------------------------------------------

// FUNCION PARA DIBUJAR LOS PRODUCTOS (recibe una lista como parámetro)

const renderizarProductos = (listaDeProductos) => {
    // IMPORTANTE: Limpiamos el contenedor antes de dibujar para que no se dupliquen
    contenedorProductos.innerHTML = "";

    listaDeProductos.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-producto");

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 200px;">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>Precio: $${producto.precio}</strong></p>
            <button onclick="alert('Agregaste: ${producto.nombre}')">Agregar al carrito</button>
        `;

        contenedorProductos.appendChild(tarjeta);
    });
};

// ------------------------------------------------------------------------------------------------

// FUNCION PARA FILTRAR

const filtrarProductos = (categoriaSeleccionada) => {
    // Creamos una nueva lista solo con los productos que coinciden con la categoría
    const productosFiltrados = productos.filter(p => p.categoria === categoriaSeleccionada);
    
    // Usamos la función de arriba para dibujar solo esos productos
    renderizarProductos(productosFiltrados);
};

// ------------------------------------------------------------------------------------------------

// EJECUCION - NO PUEDE FALTAR!!!
cargarCategorias();
renderizarProductos(productos);

// ------------------------------------------------------------------------------------------------

// CONFIGURACION BOTON "BUSCAR" DEL ¿Que te gustaria comer hoy?
// 1. Atrapamos el formulario y el input
const formulario = document.getElementById("formulario-busqueda");
const inputBusqueda = document.getElementById("buscarProducto");

// 2. Escuchamos cuando el usuario hace clic en "Buscar"
formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // EVITA que la página se recargue (¡Fundamental!) 
    
    const textoUsuario = inputBusqueda.value.toLowerCase(); // Pasamos todo a minúsculas para que sea más fácil comparar

    // 3. Filtramos los productos por NOMBRE o DESCRIPCIÓN
    const productosEncontrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(textoUsuario) || 
        p.descripcion.toLowerCase().includes(textoUsuario)
    );

    // 4. Los mostramos en pantalla usando la función que ya creamos
    renderizarProductos(productosEncontrados);
});

// ------------------------------------------------------------------------------------------------

// CONFIGURACION BOTON "mostrar todos" DEL ¿Que te gustaria comer hoy?

// 1. Atrapamos el nuevo botón de "Ver todos"
const btnVerTodos = document.getElementById("btn-ver-todos");

// 2. Modificamos el evento del formulario para incluir el mensaje de "No encontrado"
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const textoUsuario = inputBusqueda.value.toLowerCase();

    const productosEncontrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(textoUsuario) || 
        p.descripcion.toLowerCase().includes(textoUsuario)
    );

    // Lógica para el mensaje de "No se encontraron productos"
    if (productosEncontrados.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="mensaje-error">
                <p> Lo sentimos, no encontramos productos que coincidan con "${inputBusqueda.value}".</p>
                <p>¡Probá con otra palabra!</p>
            </div>
        `;
    } else {
        renderizarProductos(productosEncontrados);
    }
});

// 3. Evento para el botón "Mostrar Todos"
btnVerTodos.addEventListener("click", () => {
    inputBusqueda.value = ""; // Limpiamos el texto que haya escrito el usuario
    renderizarProductos(productos); // Volvemos a mostrar la lista completa original 
});