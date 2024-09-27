const outputArea = document.getElementById("output");
const lastTextArea = document.getElementById("lastText");
const numberInput = document.getElementById("numberInput");

const lastText = localStorage.getItem("lastText");
if (lastText) {
  lastTextArea.innerText = "Показан последний загруженный текст";
  outputArea.innerHTML = lastText;
}

document.querySelectorAll(".add-time").forEach((button) => {
  button.addEventListener("click", () => {
    const time = button.dataset.time;
    if (time === "reset") {
      numberInput.value = 1;
      return;
    }
    const newTime = parseInt(numberInput.value) + parseInt(time);
    numberInput.value = newTime;
  });
});

document.getElementById("getTextButton").addEventListener("click", function () {
  const number = document.getElementById("numberInput").value;
  const button = this;

  if (!number) {
    alert("Пожалуйста, введите число.");
    return;
  }

  if (parseFloat(number) < 1) {
    alert("Пожалуйста, введите число больше 0.");
    return;
  }

  button.setAttribute("disabled", true);
  button.innerText = "Загрузка...";

  fetch(
    `https://fish-text.ru/get?format=html&type=sentence&number=${number}.00&self=true`
  )
    .then((response) => response.text())
    .then((data) => {
      outputArea.innerHTML = data;
      lastTextArea.innerText = "";
      localStorage.setItem("lastText", data);
    })
    .catch((error) => {
      outputArea.textContent = "Ошибка при получении текста";
      console.error("Ошибка:", error);
    })
    .finally(() => {
      button.removeAttribute("disabled");
      button.innerText = "Получить текст";
    });
});

document.getElementById("copyTextButton").addEventListener("click", () => {
  const textToCopy = outputArea.textContent;

  let timeoutId;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  if (textToCopy) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        document.getElementById("copied").innerText =
          "Текст скопирован в буфер обмена!";

        timeoutId = setTimeout(() => {
          document.getElementById("copied").innerText = "";
        }, 3000);
      })
      .catch((err) => {
        alert("Не удалось скопировать текст");
        console.error("Ошибка копирования:", err);
      });
  } else {
    alert("Нет текста для копирования!");
  }
});
