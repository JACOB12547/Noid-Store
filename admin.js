let inventarioAdmin = JSON.parse(localStorage.getItem('productosNoid')) || [];
let modoEdicion = false;
let idEditando  = null;

const formProducto = document.getElementById('form-producto');
const listaAdmin   = document.getElementById('lista-admin');
const btnGuardar   = document.querySelector('.btn-guardar');
const formTitulo   = document.getElementById('form-titulo');
const btnCancelar  = document.getElementById('btn-cancelar');
formProducto.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const datos = {
        nombre:    document.getElementById('nombre').value.trim(),
        precio:    parseFloat(document.getElementById('precio').value),
        categoria: document.getElementById('categoria').value,
        imagen:    document.getElementById('imagen').value.trim()
    };

    if (modoEdicion) {
        const index = inventarioAdmin.findIndex(p => p.id === idEditando);
        inventarioAdmin[index] = { id: idEditando, ...datos };
        guardarYActualizar();
        cancelarEdicion();
        alert('✅ Producto actualizado con éxito');
    } else {
        inventarioAdmin.push({ id: Date.now(), ...datos });
        formProducto.reset();
        guardarYActualizar();
        alert('✅ Producto guardado con éxito');
    }
});
function editarProducto(id) {
    const producto = inventarioAdmin.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('nombre').value    = producto.nombre;
    document.getElementById('precio').value    = producto.precio;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('imagen').value    = producto.imagen;

    modoEdicion = true;
    idEditando  = id;

    formTitulo.textContent    = 'Editar Producto';
    btnGuardar.textContent    = 'Actualizar Producto';
    btnCancelar.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function cancelarEdicion() {
    modoEdicion = false;
    idEditando  = null;

    formProducto.reset();
    formTitulo.textContent    = 'Añadir Nuevo Producto';
    btnGuardar.textContent    = 'Guardar Producto';
    btnCancelar.style.display = 'none';
}
function eliminarProducto(id) {
    const producto = inventarioAdmin.find(p => p.id === id);
    if (!producto) return;
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;

    inventarioAdmin = inventarioAdmin.filter(p => p.id !== id);
    guardarYActualizar();
}
function guardarYActualizar() {
    localStorage.setItem('productosNoid', JSON.stringify(inventarioAdmin));
    renderizarListaAdmin();
}
function renderizarListaAdmin() {
    listaAdmin.innerHTML = '<h3>Productos Actuales</h3>';

    if (inventarioAdmin.length === 0) {
        listaAdmin.innerHTML += '<p style="color:#a0a0a0;text-align:center;margin-top:15px;">No hay productos en el inventario.</p>';
        return;
    }

    inventarioAdmin.forEach(producto => {
        const precio = producto.precio.toLocaleString('es-CO');
        const item   = document.createElement('div');
        item.classList.add('item-admin');
        item.innerHTML = `
            <div class="item-info">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="item-thumb">
                <div>
                    <strong>${producto.nombre}</strong>
                    <span class="item-precio">$${precio}</span>
                </div>
                <span class="tag-categoria">${producto.categoria}</span>
            </div>
            <div class="item-acciones">
                <button onclick="editarProducto(${producto.id})" class="btn-accion btn-editar">Editar</button>
                <button onclick="eliminarProducto(${producto.id})" class="btn-accion btn-eliminar">Eliminar</button>
            </div>
        `;
        listaAdmin.appendChild(item);
    });
}

renderizarListaAdmin();
const CATEGORIAS_BASE = ['Gorras', 'Camisetas', 'Buzos'];
if (!localStorage.getItem('categoriasNoid')) {
    localStorage.setItem('categoriasNoid', JSON.stringify(CATEGORIAS_BASE));
}

let categoriasAdmin = JSON.parse(localStorage.getItem('categoriasNoid'));
function agregarCategoria() {
    const input = document.getElementById('nueva-categoria');
    const raw   = input.value.trim();
    if (!raw) return;
    const nombre = raw.charAt(0).toUpperCase() + raw.slice(1);

    if (categoriasAdmin.includes(nombre)) {
        alert(`La categoría "${nombre}" ya existe.`);
        return;
    }

    categoriasAdmin.push(nombre);
    guardarCategorias();
    input.value = '';
    renderizarListaCategorias();
    actualizarSelectCategoria();
}
document.getElementById('nueva-categoria').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); agregarCategoria(); }
});
function eliminarCategoria(nombre) {
    const usada = inventarioAdmin.filter(p => p.categoria === nombre).length;
    let msg = `¿Eliminar la categoría "${nombre}"?`;
    if (usada > 0) {
        msg += `\n\n⚠️ ${usada} producto(s) usan esta categoría. Seguirán en la tienda bajo "Todas".`;
    }
    if (!confirm(msg)) return;

    categoriasAdmin = categoriasAdmin.filter(c => c !== nombre);
    guardarCategorias();
    renderizarListaCategorias();
    actualizarSelectCategoria();
}
function guardarCategorias() {
    localStorage.setItem('categoriasNoid', JSON.stringify(categoriasAdmin));
}
function actualizarSelectCategoria() {
    const select = document.getElementById('categoria');
    const valorActual = select.value;
    select.innerHTML = '';

    categoriasAdmin.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
    if (categoriasAdmin.includes(valorActual)) select.value = valorActual;
}
function renderizarListaCategorias() {
    const lista = document.getElementById('lista-categorias');
    lista.innerHTML = '';

    if (categoriasAdmin.length === 0) {
        lista.innerHTML = '<p style="color:#a0a0a0;font-size:0.9em;margin:0;">Sin categorías.</p>';
        return;
    }

    categoriasAdmin.forEach(cat => {
        const tag = document.createElement('span');
        tag.classList.add('categoria-tag');
        tag.innerHTML = `
            ${cat}
            <button onclick="eliminarCategoria('${cat.replace(/'/g, "\\'")}')"
                    class="btn-eliminar-cat" title="Eliminar">✕</button>
        `;
        lista.appendChild(tag);
    });
}
actualizarSelectCategoria();
renderizarListaCategorias();