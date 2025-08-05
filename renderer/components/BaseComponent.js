export class BaseComponent {
  constructor(appState) {
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

  mount(parent) {
    parent.append(this.element);
  }
}
