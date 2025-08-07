import { appState } from "../main";
import { BaseComponent } from "./BaseComponent";

export class ConnectionItem extends BaseComponent {
  constructor(id) {
    super(appState);
    this.id = id;
  }

  getTemplate() {
    document.querySelector().innerHTML = `<div class="connection-item" id="${this.id}">
      <div class="connection-info">
          <div class="device-icon"></div>
          <div class="device-info">
              <div class="device-id">socket-abc123</div>
              <div class="device-status">Available</div>
          </div>
      </div>
      <button class="connect-device-btn">Connect</button>
    </div>`;
  }
}
