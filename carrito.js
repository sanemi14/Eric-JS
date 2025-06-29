console.log("JS cargado correctamente");
let productos = [];

const productosGuardados = localStorage.getItem("productos");

if (productosGuardados) {
  productos = JSON.parse(productosGuardados);
} else {
  productos = [
    { id: 1, nombre: "Cerveza Rubia", precio: 1.5, img: "img/cerveza_rubia.jpg" },
    { id: 2, nombre: "Cerveza Negra", precio: 1.7, img: "img/cerveza_negra.jpg" },
    { id: 3, nombre: "Cerveza Roja", precio: 2, img: "img/cerveza_roja.jpg"},
    { id: 4, nombre: "Wisky", precio: 8, img: "img/wisky.jpg" },
    { id: 5, nombre: "Vino Tinto", precio: 2.5, img: "img/vino_tinto.jpg" },
    { id: 6, nombre: "Sidra", precio: 3, img: "img/sidra.jpg" },
    { id: 7, nombre: "Vodka", precio: 3, img: "img/vodka.jpg" },
    { id: 8, nombre: "Gin Tonic", precio: 5, img: "img/gintonic.jpg" },
    { id: 9, nombre: "Mojito", precio: 6, img: "img/mojito.jpg" },
    { id: 10, nombre: "Shots", precio: 1.5, img: "img/shots.jpg" },
  ];
  localStorage.setItem("productos", JSON.stringify(productos));
}

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCompra = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar-carrito");

let carrito = [];

function mostrarProductos() {
    productos.forEach(producto =>  {
        const div =document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" class="producto-img" />
            <div>
                 <p>${producto.nombre} - €${producto.precio.toFixed(2)}</p>
                 <button data-id="${producto.id}">Agregar al carrito</button>
            </div>
`;

        contenedorProductos.appendChild(div);
    });
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito =JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    
    carrito.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>
                ${item.nombre} - €${item.precio.toFixed(2)} x ${item.cantidad}
                <button class="btn-restar" data-id="${item.id}">−</button>
                <button class="btn-sumar" data-id="${item.id}">+</button>
                <button class="btn-eliminar" data-id="${item.id}">🗑️</button>
            </p>
  `;
  listaCarrito.appendChild(div);
    });

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    totalCompra.textContent = total.toFixed(2);

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
    const productoEnCarrito = carrito.find(item => item.id ===id);
    if (productoEnCarrito){
        productoEnCarrito.cantidad++;
    } else {
        const producto = productos.find(p=> p.id === id);
        carrito.push({...producto, cantidad: 1});
    }
actualizarCarrito();
}

contenedorProductos.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
        const id = parseInt(e.target.dataset.id);
        agregarAlCarrito(id);
    }
});

btnVaciar.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem("carrito");
});

listaCarrito.addEventListener("click", e => {
  const id = parseInt(e.target.dataset.id);

  if (e.target.classList.contains("btn-sumar")) {
    const item = carrito.find(p => p.id === id);
    item.cantidad++;
  }

  if (e.target.classList.contains("btn-restar")) {
    const item = carrito.find(p => p.id === id);
    item.cantidad--;
    if (item.cantidad <= 0) {
      carrito = carrito.filter(p => p.id !== id);
    }
  }

  if (e.target.classList.contains("btn-eliminar")) {
    carrito = carrito.filter(p => p.id !== id);
  }

  actualizarCarrito();
});

const formNuevo = document.getElementById("form-nuevo-producto");
const inputNombre = document.getElementById("nombre-nuevo");
const inputPrecio = document.getElementById("precio-nuevo");
const inputImg = document.getElementById("img-nuevo");

formNuevo.addEventListener("submit", e => {
  e.preventDefault();

  const nuevoProducto = {
    id: productos.length + 1,
    nombre: inputNombre.value.trim(),
    precio: parseFloat(inputPrecio.value),
    img: inputImg.value.trim()
  };

  if (!nuevoProducto.nombre || isNaN(nuevoProducto.precio) || !nuevoProducto.img) {
    alert("Por favor completá todos los campos correctamente.");
    return;
  }

  productos.push(nuevoProducto);
  localStorage.setItem("productos", JSON.stringify(productos));
  limpiarProductos();
  mostrarProductos();

  formNuevo.reset();
  alert("Producto agregado con éxito al menú");
});


function limpiarProductos() {
  contenedorProductos.innerHTML = "";
}
mostrarProductos();
cargarCarrito();

document.getElementById("resetear-stock").addEventListener("click", () => {
  if (confirm("¿Estás seguro de querer borrar todos los productos personalizados?")) {
    localStorage.removeItem("productos");
    location.reload(); 
  }
});
