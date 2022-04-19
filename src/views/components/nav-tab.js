const template = document.createElement('template');

template.innerHTML = `
<style>
  .container {
    display: flex;
    flex-direction: row;
    background-color: transparent;
    border-radius: 10px;
    color: var(--colour_text_light);
  }

  #category-image {
    margin: 2px;
    padding: 2px;
    width: 30px;
    height: 30px;
    background-color: var(--colour_back_dark);
    border-radius: 5px;
  }

  .selected {
    border: var(--colour_title) solid 1px;
  }

  .container:hover {
    border: var(--colour_title) solid 2px;
    border-left: none;
    border-bottom: none;
  }

  .inner-container {
    margin-left: 5px;
    display: none;
    background-color: var(--colour_back_dark);
    white-space: nowrap;
    padding: 5px;
    border-radius: 0 10px 10px 0;
  }

  .container:hover .inner-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  #title-text {
    color: var(--colour_title);
  }
</style>

<div class="container">
  <img id="category-image" src="#" />
  <div class="inner-container">
    <div id="title-text">Title</div>
  </div>

</div>
`;

class NavTab extends HTMLElement {
  constructor() {
    super();
    // console.log("NavTab initialised!");

    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$tab = this._shadow.querySelector(".container");
    this.$img = this._shadow.getElementById("category-image");
    this.$categoryTitle = this._shadow.getElementById("title-text");
    this.$innerContainer = this._shadow.querySelector(".inner-container");
    this.$views = {};

    // .inner-container will catch click event from view button and send it's own event to the outer nav with 'category' and 'view' in details
    this.$tab.addEventListener("onViewSelected", (event) => {
      // console.log("onViewSelected detected:", event.detail);
      this.dispatchEvent(
        new CustomEvent("onTabSelected", {
          bubbles: true,
          detail: {
            view: event.detail,
            category: this.category
          }
        })
      );
    })
  }

  static get observedAttributes() {
    return ["image", "title", "category", "selected", "views"];
  }

  get image() { return this.getAttribute("image"); }
  get selected() { return this.getAttribute("selected"); }
  get title() { return this.getAttribute("title"); }
  get category() { return this.getAttribute("category"); }
  get views() { return JSON.parse(this.getAttribute("views")); }

  set image(value) { this.setAttribute("image", value); }
  set selected(value) { this.setAttribute("selected", value); }
  set title(value) { this.setAttribute("title", value); }
  set category(value) { this.setAttribute("category", value); }
  set views(value) { this.setAttribute("views", JSON.stringify(value)); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
      case "image":
        this.$img.src = this.image;
        break;
      case "selected":
        if (this.selected == 'selected') {
          this.$tab.classList.add("selected");
        }
        else {
          this.$tab.classList.remove("selected");
        }
        break;
      case "title":
        this.$categoryTitle.innerHTML = this.title;
        break;
      case "views":
        Object.keys(this.views).forEach(key => {
          let template = document.createElement('template');
          template.innerHTML = `<view-tab></view-tab>`;
          let viewTab = template.content.firstElementChild;
          this.$innerContainer.appendChild(viewTab);
          this.$views[key] = viewTab;
          viewTab.id = this.views[key].id;
          viewTab.title = this.views[key].title;
          viewTab.image = this.views[key].image;
          this.dispatchEvent(
            new CustomEvent('registerElements', {
              bubbles: true,
              detail: this.$views
            })
          );
        });
        break;
      default:
        break;
    }
  }
}

window.customElements.define('nav-tab', NavTab);