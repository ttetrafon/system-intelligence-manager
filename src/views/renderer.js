const script = "renderer.js";
// window.main.log(script, "Started!");

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value;
    window.main.setTitle(title);
    window.main.log(script, "test log!");
});

const btnof = document.getElementById('btn-of')
const filePathElement = document.getElementById('filePath')
btnof.addEventListener('click', async () => {
  const filePath = await window.main.openFile();
  filePathElement.innerText = filePath;
});
