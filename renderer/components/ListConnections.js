import { BaseComponent } from "./BaseComponent";
import { ConnectionItem } from "./Connection-item";

export class ConnectedSockets extends BaseComponent {
  constructor(appState) {
    super(appState);

    this.unsubscribe = this.handleChanges();
    this.items = new Map();
  }

  handleChanges() {
    return this.appState.subscribe(".state.connectedSockets", (socketId) => {
      this.update(socketId);
    });
  }

  getTemplate() {
    // const connectedSockets = this.appState.connectedSockets || [];
    return `<div class="connections-container" id="container"></div>`;
  }

  update(socketId) {
    const container = this.element.querySelector("#container");
    const child = new ConnectionItem(this.appState, socketId);
    container.append(child);
  }
}
