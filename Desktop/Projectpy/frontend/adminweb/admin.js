document.addEventListener("DOMContentLoaded", () => {
  const addSneakerForm = document.getElementById("addSneakerForm");
  const ordersContainer = document.getElementById("ordersContainer");

  // Добавление кроссовок
  addSneakerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
  sneakersName: document.getElementById("sneakerName").value,
  countOfSneakers: parseInt(document.getElementById("sneakerCount").value),
  sumSneakers: parseInt(document.getElementById("sneakerPrice").value)
};
  console.log("📦 Данные для отправки:", data);



    try {
      const res = await fetch("http://127.0.0.1:8000/api/sneakers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)

      });
       const resultText = await res.text(); 
    console.log("📬 Ответ от сервера:", resultText);


      if (res.ok) {
        alert("✅ Кроссовки добавлены");
        addSneakerForm.reset();
      } else {
        alert("❌ Ошибка при добавлении.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Сервер недоступен.");
    }
  });

  async function loadOrders() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders/all");
      const orders = await res.json();

      if (orders.length === 0) {
        ordersContainer.innerHTML = "<p>Нет заказов.</p>";
        return;
      }

      let html = `<table class="table table-bordered"><thead><tr>
        <th>ID</th><th>Клиент</th><th>Кроссовки</th><th>Статус</th><th>Изменить</th></tr></thead><tbody>`;

      orders.forEach(order => {
        html += `
          <tr>
            <td>${order.id}</td>
            <td>${order.clientName}</td>
            <td>${order.nameAllsneakers}</td>
            <td>
              <select data-id="${order.id}" class="form-select order-status">
                <option ${order.status === 'Заказ поступил' ? 'selected' : ''}>Заказ поступил</option>
                <option ${order.status === 'Сборка заказа' ? 'selected' : ''}>Сборка заказа</option>
                <option ${order.status === 'Заказ отправлен' ? 'selected' : ''}>Заказ отправлен</option>
                <option ${order.status === 'Завершён' ? 'selected' : ''}>Завершён</option>
              </select>
            </td>
            <td><button class="btn btn-primary btn-sm update-status" data-id="${order.id}">Сохранить</button></td>
          </tr>`;
      });

      html += "</tbody></table>";
      ordersContainer.innerHTML = html;

      document.querySelectorAll(".update-status").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const newStatus = document.querySelector(`select[data-id="${id}"]`).value;

          try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/update-status/${id}?status=${encodeURIComponent(newStatus)}`, {
              method: "PUT"
            });

            if (response.ok) {
              alert("✅ Статус обновлён");
              loadOrders(); // перезагрузка
            } else {
              alert("❌ Не удалось обновить статус");
            }
          } catch (err) {
            console.error(err);
            alert("❌ Ошибка сервера");
          }
        });
      });

    } catch (err) {
      console.error(err);
      ordersContainer.innerHTML = "<p class='text-danger'>Ошибка при загрузке заказов.</p>";
    }
  }

  loadOrders();
});
