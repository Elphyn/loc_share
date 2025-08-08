import { BaseComponent } from "./BaseComponent";

export class ConnectionItem extends BaseComponent {
  constructor(appState, id) {
    this.id = id;
    super(appState);
  }

  getTemplate() {
    console.log("Adding: ", this.id);
    return `<div class="connection-item" id="${this.id}">
      <div class="connection-info">
          <div class="device-icon"></div>
          <div class="device-info">
              <div class="device-id">${this.id}</div>
              <div class="device-status">Available</div>
          </div>
      </div>
      <button class="connect-device-btn">Connect</button>
    </div>`;
  }
}
