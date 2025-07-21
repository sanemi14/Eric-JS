const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCompra = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar-carrito");
const btnFinalizar = document.getElementById("finalizar-compra");
const formNuevo = document.getElementById("form-nuevo-producto");
const inputNombre = document.getElementById("nombre-nuevo");
const inputPrecio = document.getElementById("precio-nuevo");
const inputImg = document.getElementById("img-nuevo");
const inputCategoria = document.getElementById("categoria-nuevo");
const sidebar = document.getElementById("sidebar");
const btnToggle = document.getElementById("toggle-theme");
const body = document.body;

let productos = [];
let carrito = [];

const stockInicial = [
  { id: 1, nombre: "Cerveza Rubia 0.33 L", precio: 1.5, img: "img/cerveza_rubia.jpg", categoria: "bebida" },
  { id: 2, nombre: "Cerveza Negra 0.33 L", precio: 1.7, img: "img/cerveza_negra.jpg", categoria: "bebida" },
  { id: 3, nombre: "Cerveza Roja 0.33 L", precio: 2, img: "img/cerveza_roja.jpg", categoria: "bebida" },
  { id: 4, nombre: "Whisky Botella", precio: 35, img: "img/wisky.jpg", categoria: "bebida" },
  { id: 5, nombre: "Vino Tinto", precio: 2.5, img: "img/vino_tinto.jpg", categoria: "bebida" },
  { id: 6, nombre: "Sidra", precio: 3, img: "img/sidra.jpg", categoria: "bebida" },
  { id: 7, nombre: "Vodka", precio: 3, img: "img/vodka.jpg", categoria: "bebida" },
  { id: 8, nombre: "Gin Tonic", precio: 5, img: "img/gintonic.jpg", categoria: "bebida" },
  { id: 9, nombre: "Mojito", precio: 6, img: "img/mojito.jpg", categoria: "bebida" },
  { id: 10, nombre: "Shots", precio: 1.5, img: "img/shots.jpg", categoria: "bebida" },
  { id: 11, nombre: "Vaso Drako Bar", precio: 4, img: "img/vaso.jpg", categoria: "merch" },
  { id: 12, nombre: "Camiseta Drako Bar", precio: 15, img: "img/camiseta.jpg", categoria: "merch" }
];

const productosGuardados = localStorage.getItem("productos");
if (productosGuardados) {
  productos = JSON.parse(productosGuardados);
} else {
  productos = [...stockInicial];
  localStorage.setItem("productos", JSON.stringify(productos));
}

async function cargarProductosAPI() {
  try {
    const res = await fetch('https://fakestoreapi.com/products?limit=4');
    const data = await res.json();
    const externos = data.map(p => ({
      id: p.id + 100,
      nombre: p.title,
      precio: p.price,
      img: p.image,
      categoria: "merch"
    }));
    productos = [...productos, ...externos];
    mostrarProductos(productos);
  } catch (err) {
    console.warn("No se pudo cargar API externa, usando solo productos locales.");
    mostrarProductos(productos);
  }
}

function mostrarProductos(productosAMostrar = productos) {
  contenedorProductos.innerHTML = "";
  productosAMostrar.forEach((producto, index) => {
    const div = document.createElement("div");
    div.classList.add("producto", "animate__animated", "animate__fadeInUp");
    div.style.setProperty("--animate-delay", `${index * 0.1}s`);
    div.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}" />
      <div>
        <p>${producto.nombre} - €${producto.precio.toFixed(2)}</p>
        <button data-id="${producto.id}">Agregar al carrito</button>
      </div>
    `;
    contenedorProductos.appendChild(div);
  });
}

function cargarCarrito() {
  const guardado = localStorage.getItem("carrito");
  if (guardado) {
    carrito = JSON.parse(guardado);
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
  const item = carrito.find(p => p.id === id);
  if (item) {
    item.cantidad++;
  } else {
    const producto = productos.find(p => p.id === id);
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarCarrito();
  Toastify({
    text: "Producto agregado al carrito 🛒",
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: { background: "#4caf50" }
  }).showToast();
}

contenedorProductos.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
    agregarAlCarrito(parseInt(e.target.dataset.id));
  }
});

listaCarrito.addEventListener("click", e => {
  const id = parseInt(e.target.dataset.id);
  if (e.target.classList.contains("btn-sumar")) {
    carrito.find(p => p.id === id).cantidad++;
  }
  if (e.target.classList.contains("btn-restar")) {
    const item = carrito.find(p => p.id === id);
    item.cantidad--;
    if (item.cantidad <= 0) carrito = carrito.filter(p => p.id !== id);
  }
  if (e.target.classList.contains("btn-eliminar")) {
    carrito = carrito.filter(p => p.id !== id);
  }
  actualizarCarrito();
});

btnVaciar.addEventListener("click", () => {
  Swal.fire({
    title: "¿Vaciar carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No"
  }).then(r => {
    if (r.isConfirmed) {
      carrito = [];
      actualizarCarrito();
      localStorage.removeItem("carrito");
      Swal.fire("Carrito vacío", "", "success");
    }
  });
});

btnFinalizar.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Agrega productos antes de comprar.", "info");
    return;
  }
  Swal.fire({
    title: "¿Confirmar compra?",
    text: `Total a pagar: €${totalCompra.textContent}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }).then(r => {
    if (r.isConfirmed) {
      carrito = [];
      actualizarCarrito();
      localStorage.removeItem("carrito");
      Swal.fire("Compra realizada", "¡Gracias por elegirnos!", "success");
    }
  });
});

formNuevo.addEventListener("submit", e => {
  e.preventDefault();
  const nuevo = {
    id: productos.length + 1,
    nombre: inputNombre.value.trim(),
    precio: parseFloat(inputPrecio.value),
    img: inputImg.value.trim(),
    categoria: inputCategoria.value
  };
  if (!nuevo.nombre || isNaN(nuevo.precio) || !nuevo.img) {
    Swal.fire("Error", "Completa todos los campos.", "error");
    return;
  }
  productos.push(nuevo);
  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductos(productos);
  formNuevo.reset();
  Toastify({
    text: "Nuevo producto agregado ✅",
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: { background: "#2196f3" }
  }).showToast();
});

document.getElementById("resetear-stock").addEventListener("click", () => {
  Swal.fire({
    title: "¿Resetear stock?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No"
  }).then(r => {
    if (r.isConfirmed) {
      localStorage.removeItem("productos");
      location.reload();
    }
  });
});

document.querySelectorAll(".filtro").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.categoria;
    if (cat === "todos") {
      mostrarProductos(productos);
    } else {
      const filtrados = productos.filter(p => p.categoria === cat);
      mostrarProductos(filtrados);
    }
  });
});

if (sidebar) {
  sidebar.classList.add("animate__animated", "animate__fadeInLeft");
}

function cargarTema() {
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "light") {
    body.classList.add("light");
  }
}
cargarTema();

btnToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  if (body.classList.contains("light")) {
    localStorage.setItem("tema", "light");
  } else {
    localStorage.removeItem("tema");
  }
});

mostrarProductos(productos);
cargarCarrito();
cargarProductosAPI();
