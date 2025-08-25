document.addEventListener("DOMContentLoaded", () => {
  const buyButtons = document.querySelectorAll(".btn-dark");

  buyButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.username) {
        alert("❌ Для покупки нужно войти в аккаунт.");
        return;
      }

      const card = button.closest(".card");
      const sneakerName = card.querySelector(".card-title").textContent;

      const orderData = {
        clientName: user.username,
        nameAllsneakers: sneakerName
      };

      console.log("🛒 Отправка заказа:", orderData);

      try {
        const res = await fetch("http://127.0.0.1:8000/api/orders/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });

        if (res.ok) {
          alert("✅ Заказ успешно оформлен!");
        } else {
          alert("❌ Ошибка при оформлении заказа.");
        }
      } catch (err) {
        console.error("❌ Ошибка сервера:", err);
        alert("❌ Сервер недоступен.");
      }
    });
  });
});
