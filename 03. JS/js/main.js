// Esto es el elemento del HTML (usando su ID). es el elemento del HTML donde irán las categorias
// Es como un buscador. Le indicamos el ID que pusimos en el HTML y trae ese elemento para trabajarlo desde JS
const contenedorCategorias = document.getElementById("lista-categorias");

const contenedorProductos = document.getElementById("contenedor-productos");

// se crea la función para cargar las categorías 
const cargarCategorias = () => {
    // con forEach se recorre el array de categorías definido en data.js
    categorias.forEach(nombreCategoria => {

        // Por cada categoría, se crea un nuevo elemento de lista <li> 
        const li = document.createElement("li");

        // Usamos Template Strings (comillas invertidas) para meter el link con el nombre de la categoría
        li.innerHTML = `<a href="#">${nombreCategoria}</a>`;

        // se mete el elemento creado en el HTML (el <li> dentro del <ul> padre)
        contenedorCategorias.appendChild(li);
    });
};

// ejecuta la función. NO PUEDE FALTAR
cargarCategorias();

// se crea la función para cargar los productos
const cargarProductos = () => {
    // se recorre el array de objetos 'productos' de data.js
    productos.forEach(producto => {
        // se crea un elemento <article> para que sea la tarjeta del producto
        const tarjeta = document.createElement("article");
        
        // Usamos Template Strings para maquetar toda la tarjeta de una vez
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 200px;">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>Precio: $${producto.precio}</strong></p>
            <button>Agregar al carrito</button>
        `;

        // se mete la tarjeta en el contenedor de productos
        contenedorProductos.appendChild(tarjeta);
    });
};

// ejecuta la funcion
cargarProductos();