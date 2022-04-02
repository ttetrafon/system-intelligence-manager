const script = "renderer.js";
window.main.log("renderer.js", "Started!");

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value;
    window.main.setTitle(title);
    window.main.log(script, "test log!");
});
