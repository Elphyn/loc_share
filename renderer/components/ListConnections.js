import { BaseComponent } from "./BaseComponent";
import { ConnectionItem } from "./Connection-item";

export class ConnectedSockets extends BaseComponent {
  constructor(appState) {
    super(appState);

    this.connectUnsubscribe = this.handleChangesConnection();
    this.disconnectUnsubscribe = this.handleChangesDisconnection();
    this.items = new Map();
  }

  handleChangesConnection() {
    return this.appState.subscribe(".state.connectedSockets", (socketId) => {
      this.updateConnections(socketId);
    });
  }
  handleChangesDisconnection() {
    return this.appState.subscribe(
      ".state.connectedSockets.disconnected",
      (socketId) => {
        this.updateDisconnections(socketId);
      },
    );
  }

  getTemplate() {
    return `<div class="connections-container" id="container"></div>`;
  }

  updateConnections(socketId) {
    console.log("updateConnections: ", socketId);
    const container = this.element.querySelector("#container");
    const child = new ConnectionItem(this.appState, socketId);
    this.items.set(child, child.element);
    container.append(child.element);
  }
  updateDisconnections(socketId) {
    const container = this.element.querySelector("#container");
    const child = this.items.get(socketId);
    this.items.delete(socketId);
    container.remove(child);
  }
}
