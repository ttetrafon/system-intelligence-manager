const script = "renderer.js";
window.main.log(script, "Started!");

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value;
  window.main.setTitle(title);
});

const btn_of = document.getElementById('btn-of')
const filePathElement = document.getElementById('filePath')
btn_of.addEventListener('click', async () => {
  const filePath = await window.main.openFile();
  filePathElement.innerText = filePath;
});
