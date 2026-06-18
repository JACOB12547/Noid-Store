'use strict';

const fmtCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0
});

class Producto {
  constructor({ id, nombre, precio, categoria, imagen }) {
    this.id        = id;
    this.nombre    = nombre;
    this.precio    = Number(precio);
    this.categoria = categoria;
    this.imagen    = imagen;
  }
  formatPrecio() {
    return fmtCOP.format(this.precio);
  }

  toJSON() {
    return {
      id:        this.id,
      nombre:    this.nombre,
      precio:    this.precio,
      categoria: this.categoria,
      imagen:    this.imagen
    };
  }
}

class ProductoGorra extends Producto {
  constructor(data) {
    super(data);
    this.tipo = 'gorra';
  }
}

class ProductoCamiseta extends Producto {
  constructor(data) {
    super(data);
    this.tipo = 'camiseta';
  }
}

class ProductoBuzo extends Producto {
  constructor(data) {
    super(data);
    this.tipo = 'buzo';
  }
}

class ProductFactory {
  static register(categoria, Clase = Producto) {
    ProductFactory._registry.set(categoria, Clase);
  }

  static create(data) {
    const Clase = ProductFactory._registry.get(data.categoria) ?? Producto;
    return new Clase(data);
  }

  static createFromArray(arr) {
    return arr.map(data => ProductFactory.create(data));
  }
}

ProductFactory._registry = new Map([
  ['Gorras',    ProductoGorra],
  ['Camisetas', ProductoCamiseta],
  ['Buzos',     ProductoBuzo],
]);

class UIComponentFactory {

  static createProductCard(producto, cantidad = 0) {
    const card = document.createElement('div');
    card.classList.add('tarjeta-producto');
    card.dataset.id = producto.id;

    card.innerHTML = `
      <div class="tarjeta-img-wrap">
        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        <span class="badge-cat">${producto.categoria}</span>
      </div>
      <div class="tarjeta-info">
        <span class="tarjeta-nombre">${producto.nombre}</span>
        <span class="tarjeta-precio">${producto.formatPrecio()}</span>
      </div>
      <div class="tarjeta-actions">
        <div class="qty-control">
          <button class="qty-btn" onclick="cambiarCantidad(${producto.id}, -1)">−</button>
          <span class="qty-num" id="qty-${producto.id}">${cantidad}</span>
          <button class="qty-btn" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
        </div>
        <button class="btn-agregar ${cantidad > 0 ? 'en-carrito' : ''}"
                id="btn-add-${producto.id}"
                onclick="agregarAlCarrito(${producto.id})">
          ${cantidad > 0 ? '✓ Agregado' : 'Agregar'}
        </button>
      </div>
    `;

    return card;
  }

  static createCartItem(producto, cantidad) {
    const item = document.createElement('div');
    item.classList.add('drawer-item');

    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="drawer-item-info">
        <span class="drawer-item-nombre">${producto.nombre}</span>
        <span class="drawer-item-precio">${producto.formatPrecio()}</span>
        <div class="drawer-qty">
          <button class="qty-btn sm" onclick="cambiarEnCarrito(${producto.id}, -1)">−</button>
          <span>${cantidad}</span>
          <button class="qty-btn sm" onclick="cambiarEnCarrito(${producto.id}, 1)">+</button>
        </div>
      </div>
      <div class="drawer-item-subtotal">
        <span>${fmtCOP.format(producto.precio * cantidad)}</span>
        <button class="btn-eliminar" onclick="eliminarDelCarrito(${producto.id})">✕</button>
      </div>
    `;

    return item;
  }

  static createFilterButton(categoria, isActive = false) {
    const btn = document.createElement('button');
    btn.classList.add('btn-filtro');
    if (isActive) btn.classList.add('activo');
    btn.textContent = categoria;
    btn.onclick = function () { filtrarProductos(categoria, this); };
    return btn;
  }

  static createAdminItem(producto) {
    const precioFmt = producto.precio.toLocaleString('es-CO');
    const item = document.createElement('div');
    item.classList.add('item-admin');

    item.innerHTML = `
      <div class="item-info">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="item-thumb">
        <div>
          <strong>${producto.nombre}</strong>
          <span class="item-precio">$${precioFmt}</span>
        </div>
        <span class="tag-categoria">${producto.categoria}</span>
      </div>
      <div class="item-acciones">
        <button onclick="editarProducto(${producto.id})" class="btn-accion btn-editar">Editar</button>
        <button onclick="eliminarProducto(${producto.id})" class="btn-accion btn-eliminar">Eliminar</button>
      </div>
    `;

    return item;
  }

  static createCategoryTag(categoria) {
    const tag = document.createElement('span');
    tag.classList.add('categoria-tag');

    tag.innerHTML = `
      ${categoria}
      <button onclick="eliminarCategoria('${categoria.replace(/'/g, "\\'")}')"
              class="btn-eliminar-cat" title="Eliminar">✕</button>
    `;

    return tag;
  }
}