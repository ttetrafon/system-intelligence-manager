export class ViewTabData {
  // Describes a secondary tab within a navigational tab in the application window.

  constructor(id, title, image) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.selected = null;
  }
}