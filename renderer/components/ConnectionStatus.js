import { BaseComponent } from "./BaseComponent";

export class ConnectionStatusBar extends BaseComponent {
  constructor(data, appState) {
    super(data, appState);
    this.unsubscribe = this.handleChanges();
  }
  handleChanges() {
    return this.appState.subscribe("server-connection", (newData) => {
      this.update(newData);
    });
  }
  getTemplate() {
    return `<h1>${this.data}</h1>`;
  }
  update(newData) {
    this.data = newData;
    this.element.innerHTML = this.getTemplate();
  }
}
