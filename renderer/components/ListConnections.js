import { appState } from "../main";
import { BaseComponent } from "./BaseComponent";
import { ConnectionItem } from "./Connection-item";

export class ConnectedSockets extends BaseComponent {
  constructor() {
    super(appState);

    this.unsubscribe = this.handleChanges();
    this.items = new Map();
  }

  handleChanges() {
    return this.appState.subscribe(".state.connectedSockets", (socketId) => {
      update(socketId);
    });
  }

  getTemplate() {
    // const connectedSockets = this.appState.connectedSockets || [];
    return (container = `<div class="connections-container">
    </div>`);

    // connectedSockets.forEach((socketId) => {
    //   const child = new ConnectionItem(appState, socketId);
    //   this.items.set(socketId, child);
    //   container.append(child);
    // });
  }

  update(socketId) {
    const container = this.element.querySelector(".connections-container");
    const child = new ConnectionItem(appState, socketId);
    container.append(child);
  }
}
