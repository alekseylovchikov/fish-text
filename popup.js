// DOM elements
const outputArea = document.getElementById("output");
const lastTextArea = document.getElementById("lastText");
const numberInput = document.getElementById("numberInput");
const getTextButton = document.getElementById("getTextButton");
const copyTextButton = document.getElementById("copyTextButton");
const copiedMessage = document.getElementById("copied");
const addTimeButtons = document.querySelectorAll(".add-time");

// Functions
function displayLastText() {
  const lastText = localStorage.getItem("lastText");
  if (lastText) {
    lastTextArea.innerText = "Показан последний загруженный текст";
    outputArea.innerHTML = lastText;
  }
}

function updateNumberInput(time) {
  if (time === "reset") {
    numberInput.value = 1;
  } else {
    numberInput.value = parseInt(numberInput.value) + parseInt(time);
  }
}

function fetchText(number) {
  return fetch(
    `https://fish-text.ru/get?format=html&type=sentence&number=${number}.00&self=true`
  ).then((response) => response.text());
}

function updateButtonState(button, isLoading) {
  button.disabled = isLoading;
  button.innerText = isLoading ? "Загрузка..." : "Получить текст";
}

function handleGetTextClick() {
  const number = numberInput.value;

  if (!number || parseFloat(number) < 1) {
    alert(
      number
        ? "Пожалуйста, введите число больше 0."
        : "Пожалуйста, введите число."
    );
    return;
  }

  updateButtonState(getTextButton, true);

  fetchText(number)
    .then((data) => {
      outputArea.innerHTML = data;
      lastTextArea.innerText = "";
      localStorage.setItem("lastText", data);
    })
    .catch((error) => {
      outputArea.textContent = "Ошибка при получении текста";
      console.error("Ошибка:", error);
    })
    .finally(() => updateButtonState(getTextButton, false));
}

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

function showCopiedMessage() {
  copiedMessage.innerText = "Текст скопирован в буфер обмена!";
  setTimeout(() => {
    copiedMessage.innerText = "";
  }, 3000);
}

function handleCopyTextClick() {
  const textToCopy = outputArea.textContent;

  if (!textToCopy) {
    alert("Нет текста для копирования!");
    return;
  }

  copyToClipboard(textToCopy)
    .then(showCopiedMessage)
    .catch((err) => {
      alert("Не удалось скопировать текст");
      console.error("Ошибка копирования:", err);
    });
}

// Event listeners
addTimeButtons.forEach((button) => {
  button.addEventListener("click", () =>
    updateNumberInput(button.dataset.time)
  );
});

getTextButton.addEventListener("click", handleGetTextClick);
copyTextButton.addEventListener("click", handleCopyTextClick);

// Initialize
displayLastText();
