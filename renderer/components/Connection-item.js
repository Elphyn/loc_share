import { peerManager } from "../peerManager";
import { BaseComponent } from "./BaseComponent";

export class ConnectionItem extends BaseComponent {
  constructor(appState, id) {
    super(appState);
    this.id = id;
  }

  getTemplate() {
    console.log("Adding element, localId", this.appState.state.localId);
    return `<div class="connection-item" id="${this.id}">
      <div class="connection-info">
          <div class="device-icon"><img src="../src/laptop.svg" alt="Laptop icon"></div>
          <div class="device-info">
              <div class="device-id">${this.id}</div>
              <div class="device-status">Available</div>
          </div>
      </div>
      <button class="connect-device-btn" ${this.id !== this.appState.state.localId ? "" : "disabled"}>${this.id !== this.appState.state.localId ? "Connect" : "Local"}</button>
    </div>`;
  }

  createElement() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    return element;
  }

  addEventListeners() {
    const connectToButton = this.element.querySelector(".connect-device-btn");
    const remoteId = this.id;
    connectToButton.addEventListener("click", async () => {
      console.log(
        `Connecting to peer: ${remoteId} from ${this.appState.state.localId}`,
      );
      try {
        peerManager.connect(remoteId);
        console.log("Connected");
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    });
  }

  mount(parent) {
    this.element = this.createElement();
    this.addEventListeners();
    parent.append(this.element);
  }
}
