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
    return `<div class="${"header-bar"}">
<div class="status-dot${this.data === "connected" ? "" : " dead"}"></div>
<span>Server is ${this.data === "connected" ? "running" : "not runing"}</span>
</div>`;
  }
  update(newData) {
    this.data = newData;
    this.element.innerHTML = this.getTemplate();
  }
}
