import { BaseComponent } from "./BaseComponent";

export class ConnectionStatusBar extends BaseComponent {
  constructor(appState) {
    super(appState);
    this.connectionStatus = appState.state.serverStatus;
    this.unsubscribe = this.handleChanges();
  }
  handleChanges() {
    return this.appState.subscribe("server-connection", (newData) => {
      this.connectionStatus = newData;
      this.update();
    });
  }
  getTemplate() {
    return `<div class="${"header-bar"}">
<div class="status-dot ${this.connectionStatus === "connected" ? "" : "dead"}"></div>
<span class="status-text">Server is ${this.connectionStatus === "connected" ? "running" : "not running"}</span>
</div>`;
  }
  update() {
    const dot = this.element.querySelector(".status-dot");
    const text = this.element.querySelector(".status-text");

    dot.className = `status-dot ${this.connectionStatus === "connected" ? "" : "dead"}`;
    text.textContent = `Server is ${this.connectionStatus === "connected" ? "running" : "not running"}`;
  }
}
