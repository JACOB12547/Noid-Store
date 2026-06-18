
const inventarioBaseData = [
  { id: 1, nombre: 'Gorra Classic Black',  precio: 55000,  categoria: 'Gorras',    imagen: 'https://static.caphunters.com/13499-large_default/gorra-plana-negra-ajustada-59fifty-black-on-black-de-new-york-yankees-mlb-de-new-era.webp' },
  { id: 2, nombre: 'Camiseta OS Logo',     precio: 85000,  categoria: 'Camisetas', imagen: 'https://image.made-in-china.com/202f0j00zpPbjynhLZkg/Custom-Streetwear-T-Shirt-Cotton-Designer-Stylish-Oversize-Printing-Man-s-T-Shirt.webp' },
  { id: 3, nombre: 'Gorra Minimal White',  precio: 60000,  categoria: 'Gorras',    imagen: 'https://static.caphunters.com/37928-large_default/gorra-plana-blanca-y-negra-ajustada-59fifty-championships-de-new-york-yankees-mlb-de-new-era.webp' },
  { id: 4, nombre: 'Camiseta Heavyweight', precio: 90000,  categoria: 'Camisetas', imagen: 'https://i.etsystatic.com/60360154/r/il/fed525/7568386966/il_fullxfull.7568386966_rodi.jpg' },
  { id: 5, nombre: 'Gorra Trucker',        precio: 50000,  categoria: 'Gorras',    imagen: 'https://dcdn-us.mitiendanube.com/stores/004/262/497/products/41132c3a16c762dd1496c88b791a8112-7c41800ba55d261c1a17678068494810-1024-1024.webp' },
  { id: 6, nombre: 'Camiseta Trival',      precio: 120000, categoria: 'Camisetas', imagen: 'https://images-na.ssl-images-amazon.com/images/I/61cjewxmc3L._AC_UL600_SR600,600_.jpg' }
];

const productosAdminData = JSON.parse(localStorage.getItem('productosNoid')) || [];
let inventario = ProductFactory.createFromArray([...inventarioBaseData, ...productosAdminData]);

const carrito    = {};
const WA_NUMBER  = '573112057938';

const contenedorProductos = document.getElementById('contenedor-productos');
const statTotal            = document.getElementById('stat-total');
const carritoDrawer        = document.getElementById('carrito-drawer');
const carritoItems         = document.getElementById('carrito-items');
const carritoTotal         = document.getElementById('carrito-total');
const carritoCount         = document.getElementById('carrito-count');
const carritoCountBubble   = document.getElementById('carrito-count-bubble');
const btnWhatsapp          = document.getElementById('btn-whatsapp');
const carritoVacio         = document.getElementById('carrito-vacio');
const btnAbrirCarrito      = document.getElementById('btn-abrir-carrito');
const overlay              = document.getElementById('overlay');

function renderizarProductos(productosAMostrar) {
  contenedorProductos.innerHTML = '';
  if (statTotal) statTotal.textContent = productosAMostrar.length;

  if (productosAMostrar.length === 0) {
    contenedorProductos.innerHTML =
      '<div class="empty-state">No hay productos en esta categoría.</div>';
    return;
  }

  productosAMostrar.forEach(producto => {
    const cantidad = carrito[producto.id]?.cantidad ?? 0;
    const card     = UIComponentFactory.createProductCard(producto, cantidad);
    contenedorProductos.appendChild(card);
  });
}

function cambiarCantidad(id, delta) {
  const qtyEl = document.getElementById(`qty-${id}`);
  if (!qtyEl) return;
  let val = parseInt(qtyEl.textContent) + delta;
  if (val < 0) val = 0;
  qtyEl.textContent = val;
}

function agregarAlCarrito(id) {
  const producto = inventario.find(p => p.id === id);
  const qtyEl    = document.getElementById(`qty-${id}`);
  let   cantidad = parseInt(qtyEl?.textContent || 1);

  if (cantidad === 0) {
    qtyEl.textContent = 1;
    agregarAlCarrito(id);
    return;
  }

  if (carrito[id]) {
    carrito[id].cantidad = cantidad;
  } else {
    carrito[id] = { producto, cantidad };
  }

  const btnAdd = document.getElementById(`btn-add-${id}`);
  if (btnAdd) {
    btnAdd.classList.add('en-carrito');
    btnAdd.textContent = '✓ Agregado';
  }

  actualizarCarritoUI();
  pulsar(btnAbrirCarrito);
}

function eliminarDelCarrito(id) {
  delete carrito[id];
  actualizarCarritoUI();
  renderizarDrawer();

  const qtyEl  = document.getElementById(`qty-${id}`);
  const btnAdd = document.getElementById(`btn-add-${id}`);
  if (qtyEl)  qtyEl.textContent = '0';
  if (btnAdd) { btnAdd.classList.remove('en-carrito'); btnAdd.textContent = 'Agregar'; }
}

function calcularTotal() {
  return Object.values(carrito).reduce(
    (sum, { producto, cantidad }) => sum + producto.precio * cantidad, 0
  );
}

function calcularItems() {
  return Object.values(carrito).reduce((sum, { cantidad }) => sum + cantidad, 0);
}

function actualizarCarritoUI() {
  const total = calcularTotal();
  const items = calcularItems();

  carritoTotal.textContent = fmtCOP.format(total);
  carritoCount.textContent = `${items} item${items !== 1 ? 's' : ''}`;

  if (items > 0) {
    carritoCountBubble.textContent = items;
    carritoCountBubble.classList.add('visible');
    btnWhatsapp.disabled = false;
  } else {
    carritoCountBubble.classList.remove('visible');
    btnWhatsapp.disabled = true;
  }

  renderizarDrawer();
}
function renderizarDrawer() {
  const keys = Object.keys(carrito);
  carritoVacio.style.display = keys.length === 0 ? 'flex' : 'none';
  carritoItems.innerHTML     = '';

  keys.forEach(id => {
    const { producto, cantidad } = carrito[id];
    const itemEl = UIComponentFactory.createCartItem(producto, cantidad);
    carritoItems.appendChild(itemEl);
  });
}

function cambiarEnCarrito(id, delta) {
  if (!carrito[id]) return;
  carrito[id].cantidad += delta;

  if (carrito[id].cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }

  const qtyEl = document.getElementById(`qty-${id}`);
  if (qtyEl) qtyEl.textContent = carrito[id].cantidad;
  actualizarCarritoUI();
}

function abrirCarrito() {
  carritoDrawer.classList.add('open');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  carritoDrawer.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

btnAbrirCarrito.addEventListener('click', abrirCarrito);
overlay.addEventListener('click', cerrarCarrito);
document.getElementById('btn-cerrar-carrito').addEventListener('click', cerrarCarrito);

btnWhatsapp.addEventListener('click', () => {
  const keys = Object.keys(carrito);
  if (keys.length === 0) return;

  let msg = '🛍️ *Pedido NOID STORE*\n\n';
  keys.forEach(id => {
    const { producto, cantidad } = carrito[id];
    msg += `• ${producto.nombre} × ${cantidad} → ${fmtCOP.format(producto.precio * cantidad)}\n`;
  });
  msg += `\n*Total: ${fmtCOP.format(calcularTotal())}*`;
  msg += '\n\n¡Hola! Me gustaría realizar este pedido 🙌';

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});

function filtrarProductos(categoriaSeleccionada, btn) {
  document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('activo'));
  if (btn) btn.classList.add('activo');

  const lista = categoriaSeleccionada === 'Todas'
    ? inventario
    : inventario.filter(p => p.categoria === categoriaSeleccionada);

  renderizarProductos(lista);
}

function renderizarFiltros() {
  const contenedorFiltros   = document.querySelector('.filtros');
  const categoriasGuardadas = JSON.parse(localStorage.getItem('categoriasNoid'))
                              || ['Gorras', 'Camisetas', 'Buzos'];

  contenedorFiltros.innerHTML = '';

  contenedorFiltros.appendChild(
    UIComponentFactory.createFilterButton('Todas', true)
  );

  categoriasGuardadas.forEach(cat => {
    contenedorFiltros.appendChild(UIComponentFactory.createFilterButton(cat));
  });
}

function pulsar(el) {
  if (!el) return;
  el.classList.remove('pulsar');
  void el.offsetWidth;
  el.classList.add('pulsar');
  el.addEventListener('animationend', () => el.classList.remove('pulsar'), { once: true });
}

window.addEventListener('storage', function (evento) {
  if (evento.key === 'productosNoid' || evento.key === 'categoriasNoid') {
    location.reload();
  }
});

renderizarFiltros();
renderizarProductos(inventario);
actualizarCarritoUI();