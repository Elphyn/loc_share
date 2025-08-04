export class BaseComponent {
  constructor(data, appState) {
    this.data = data;
    this.appState = appState;
    this.element = this.createElement();
  }

  createElement() {
    // mini DOM
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    return element;
  }

  getTemplate() {
    throw new Error("You must create a component in component");
  }
  render() {
    return this.element;
  }
}
