document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const phoneInput = document.getElementById("phone");
  const navUserArea = document.getElementById("nav-user-area");
  const user = JSON.parse(localStorage.getItem("user"));

  //  отображение иконки пользователя в навбаре
  if (user && navUserArea) {
    navUserArea.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
          👤 ${user.username}
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#" id="logoutBtn">Выйти</a></li>
        </ul>
      </li>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  }

  //  автоформат телефона
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let x = e.target.value.replace(/\D/g, "").slice(0, 11);
      if (x.startsWith("8")) x = "7" + x.slice(1);
      if (!x.startsWith("7")) x = "7" + x;

      let formatted = "+7";
      if (x.length > 1) formatted += " (" + x.slice(1, 4);
      if (x.length >= 4) formatted += ") " + x.slice(4, 7);
      if (x.length >= 7) formatted += "-" + x.slice(7, 9);
      if (x.length >= 9) formatted += "-" + x.slice(9, 11);
      e.target.value = formatted;
    });
  }

  // регистрация
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        username: document.getElementById("name").value,
        mail: document.getElementById("email").value,
        phoneNumber: document.getElementById("phone").value
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert("✅ Регистрация прошла успешно!");
          registerForm.reset();
        } else {
          alert("❌ Ошибка при регистрации.");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Сервер недоступен.");
      }
    });
  }

  // вход
 
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const errorBlock = document.getElementById("loginError");

    console.log("Пробуем войти с:", { username, email });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, mail: email })
      });

      const responseText = await response.text();
      console.log("Ответ от сервера:", responseText);

      if (response.ok) {
        const user = JSON.parse(responseText);
        localStorage.setItem("user", JSON.stringify(user));

        alert("✅ Успешный вход!");
        window.location.href = "index.html";
      } else {
        errorBlock.innerText = "❌ Неверное имя или email.";
      }

    } catch (err) {
      console.error(err);
      errorBlock.innerText = "❌ Ошибка сервера.";
    }
  });
}
});
