const socket = io();

socket.on("productos", (products) => {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = "<p>No hay productos disponibles</p>";
    return;
  }

  products.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <h2>${p.title}</h2>
      <p>Precio: $${p.price}</p>
      <img src="${p.thumbnail}" width="100" />
      <button class="deleteBtn" data-id="${p.id}">Eliminar</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!id) return;

      await fetch(`/api/products/${id}`, { method: "DELETE" });
      // El servidor emite automáticamente la actualización
    });
  });
});
