// Simplified version - less reactive, more straightforward
import { peerManager } from "../peerManager";
import { BaseComponent } from "./BaseComponent";

export class ConnectionItem extends BaseComponent {
  constructor(appState, id) {
    super(appState);
    this.id = id;
    this.isConnected = false;
    this.isLocal = id === appState.state.localId;

    // Simple subscription - just rebuild when peer status changes
    this.unsubscribe = this.appState.subscribe(".state.peerStatus", () => {
      this.rebuild();
    });
  }

  rebuild() {
    if (!this.element) return;
    const newElement = this.createElement();
    this.addEventListeners(newElement);
    this.element.replaceWith(newElement);
    this.element = newElement;
  }

  getTemplate() {
    const isConnected = this.appState.state.peerStatus === "connected";
    const buttonText = this.isLocal
      ? "Local"
      : isConnected
        ? "Disconnect"
        : "Connect";
    const buttonClass = this.isLocal ? "local" : "";
    const itemClass = isConnected ? "connected-peer" : "";

    return `
      <div class="connection-item ${itemClass}" id="${this.id}">
        <div class="connection-info">
          <div class="device-icon">
            <img src="../src/laptop.svg" alt="Laptop icon">
          </div>
          <div class="device-info">
            <div class="device-id">${this.id}</div>
            <div class="device-status">${this.isLocal ? "Local" : "Available"}</div>
          </div>
        </div>
        <button class="connect-device-btn ${buttonClass}" ${this.isLocal ? "disabled" : ""}>
          ${buttonText}
        </button>
      </div>
    `;
  }

  addEventListeners(element = this.element) {
    const button = element.querySelector(".connect-device-btn");
    if (!button || this.isLocal) return;

    button.addEventListener("click", () => {
      try {
        if (this.appState.state.peerStatus === "connected") {
          console.log("Disconnect clicked");
        } else {
          console.log(`Connecting to peer: ${this.id}`);
          peerManager.connect(this.id);
        }
      } catch (err) {
        console.error("Connection error:", err);
      }
    });
  }

  mount(parent) {
    this.element = this.createElement();
    this.addEventListeners();
    parent.append(this.element);
  }

  destroy() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.element) this.element.remove();
  }
}
