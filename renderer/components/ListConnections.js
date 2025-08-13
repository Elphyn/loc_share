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
      try {
        this.updateConnections(socketId);
      } catch (err) {
        console.error("An error trying to add socket", err);
      }
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
    if (!this.appState.state.localId) {
      const intervalId = setInterval(() => {
        if (this.appState.state.localId) {
          clearInterval(intervalId);
          this.addItem(socketId);
        }
      }, 50);
    } else {
      this.addItem(socketId);
    }
  }

  addItem(socketId) {
    console.log("Adding socket");
    const container = this.element.querySelector("#container");
    const child = new ConnectionItem(this.appState, socketId);
    this.items.set(socketId, child);
    child.mount(container);
  }

  updateDisconnections(socketId) {
    const child = this.items.get(socketId);
    child.destroy();
  }
}
