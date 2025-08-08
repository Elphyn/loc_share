import { BaseComponent } from "./BaseComponent";

export class ConnectionItem extends BaseComponent {
  constructor(appState, id) {
    super(appState);
    this.id = id;
  }

  getTemplate() {
    console.log("Adding: ", this.id);
    return `<div class="connection-item" id="${this.id}">
      <div class="connection-info">
          <div class="device-icon"><img src="../src/laptop.svg" alt="Laptop icon"></div>
          <div class="device-info">
              <div class="device-id">${this.id}</div>
              <div class="device-status">Available</div>
          </div>
      </div>
      <button class="connect-device-btn">Connect</button>
    </div>`;
  }
}
