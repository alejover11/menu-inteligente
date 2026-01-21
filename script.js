let menuData = [];
let pedido = [];

// Cargar menú desde JSON
fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    menuData = data;
    mostrarMenu();
  })
  .catch(err => console.error("Error cargando el menú:", err));

// Mostrar menú completo
function mostrarMenu() {
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = '';

  const categorias = [...new Set(menuData.map(item => item.categoria))];

  categorias.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.innerHTML = `<h3>${cat}</h3>`;
    
    menuData.filter(p => p.categoria === cat).forEach(plato => {
      const platoDiv = document.createElement('div');
      platoDiv.className = 'item';
      platoDiv.innerHTML = `
        <span><strong>${plato.plato}</strong> - ${plato.precio} COP</span>
        <button onclick="agregarAlPedido('${plato.plato}', ${plato.precio})">Agregar</button>
      `;
      catDiv.appendChild(platoDiv);
    });

    menuList.appendChild(catDiv);
  });
}

// Mostrar recomendaciones desde JSON
function mostrarRecomendaciones() {
  fetch('recomendaciones_menu_qr.json')
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById("recomendaciones-list");
      contenedor.innerHTML = "";

      // Tomar los 5 primeros productos más pedidos
      data.slice(0, 5).forEach(item => {
        const nombre = item.producto || "Nombre no definido"; // campo corregido
        const cantidad = item.cantidad || 0; // campo corregido

        const div = document.createElement("div");
        div.classList.add("recomendacion-item");
        div.innerHTML = `<strong>${nombre}</strong><br><span>${cantidad} pedidos</span>`;
        contenedor.appendChild(div);
      });
    })
    .catch(err => console.error("Error cargando recomendaciones:", err));
}

// Llamar la función después de cargar el menú
setTimeout(mostrarRecomendaciones, 500);

// Agregar al pedido
function agregarAlPedido(nombre, precio) {
  pedido.push({ nombre, precio });
  actualizarPedido();
}

// Actualizar pedido y total
function actualizarPedido() {
  const pedidoList = document.getElementById('pedido-list');
  pedidoList.innerHTML = '';
  let total = 0;

  pedido.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - ${item.precio} COP`;
    pedidoList.appendChild(li);
    total += item.precio;
  });

  document.getElementById('total').textContent = total;
}

// Confirmar pedido
document.getElementById('confirmar-pedido').addEventListener('click', () => {
  if(pedido.length === 0){
    alert("Agrega al menos un plato a tu pedido.");
    return;
  }

  const historialList = document.getElementById('historial-list');
  
  const li = document.createElement('li');
  li.innerHTML = `<strong>Pedido #${historialList.children.length + 1}</strong><br>` +
                 pedido.map(item => `${item.nombre} - ${item.precio} COP`).join('<br>') +
                 `<br><em>Total: ${pedido.reduce((acc, i) => acc + i.precio, 0)} COP</em><hr>`;
  
  historialList.appendChild(li);

  alert("¡Pedido confirmado y registrado en la demo!");
  
  pedido = [];
  actualizarPedido();
});



