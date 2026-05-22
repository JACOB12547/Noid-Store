const inventario = [
    { id: 1, nombre: "Gorra Classic Black", precio: 55000, categoria: "Gorras", imagen: "https://static.caphunters.com/13499-large_default/gorra-plana-negra-ajustada-59fifty-black-on-black-de-new-york-yankees-mlb-de-new-era.webp" },
    { id: 2, nombre: "Camiseta OS Logo", precio: 85000, categoria: "Camisetas", imagen: "https://image.made-in-china.com/202f0j00zpPbjynhLZkg/Custom-Streetwear-T-Shirt-Cotton-Designer-Stylish-Oversize-Printing-Man-s-T-Shirt.webp" },
    { id: 3, nombre: "Gorra Minimal White", precio: 60000, categoria: "Gorras", imagen: "https://static.caphunters.com/37928-large_default/gorra-plana-blanca-y-negra-ajustada-59fifty-championships-de-new-york-yankees-mlb-de-new-era.webp" },
    { id: 4, nombre: "Camiseta Heavyweight", precio: 90000, categoria: "Camisetas", imagen: "https://i.etsystatic.com/60360154/r/il/fed525/7568386966/il_fullxfull.7568386966_rodi.jpg" },
    { id: 5, nombre: "Gorra Trucker", precio: 50000, categoria: "Gorras", imagen: "https://dcdn-us.mitiendanube.com/stores/004/262/497/products/41132c3a16c762dd1496c88b791a8112-7c41800ba55d261c1a17678068494810-1024-1024.webp" },
    { id: 6, nombre: "Camiseta Trival", precio: 120000, categoria: "Camisetas", imagen: "https://images-na.ssl-images-amazon.com/images/I/61cjewxmc3L._AC_UL600_SR600,600_.jpg" }
];
const contenedorProductos = document.getElementById('contenedor-productos');

function renderizarProductos(productosAMostrar) {
    contenedorProductos.innerHTML = '';

    if (productosAMostrar.length === 0) {
        contenedorProductos.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No hay productos en esta categoría.</p>';
        return;
    }

    productosAMostrar.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');
        
        const precioFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.precio);

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">${precioFormateado}</p>
        `;
        contenedorProductos.appendChild(tarjeta);
    });
}

function filtrarProductos(categoriaSeleccionada) {
    if (categoriaSeleccionada === 'Todas') {
        renderizarProductos(inventario); 
    } else {
        const productosFiltrados = inventario.filter(producto => producto.categoria === categoriaSeleccionada);
        renderizarProductos(productosFiltrados); // Muestra los filtrados
    }
}

renderizarProductos(inventario);