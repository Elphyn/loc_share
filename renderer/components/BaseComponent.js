export class BaseComponent {
  constructor(appState) {
    this.appState = appState;
    this.element = null;
  }

  createElement() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    return element;
  }

  getTemplate() {
    throw new Error("You must create a component in component");
  }

  mount(parent) {
    this.element = this.createElement();
    parent.append(this.element);
  }
  destroy() {
    this.element.remove();
  }
}
