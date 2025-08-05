import { initPeerManager } from "../peerManager";
import { socketManager } from "../socketManager";
import { BaseComponent } from "./BaseComponent";

export class DiscoverDevices extends BaseComponent {
  constructor(appState) {
    super(appState);
    this.serverStatus = this.appState.state.serverStatus;
    this.unsubscribe = this.handleChange();
    this.addEventListeners();
  }

  handleChange() {
    return this.appState.subscribe("server-connection", (newData) => {
      this.serverStatus = newData;
      this.update();
    });
  }
  addEventListeners() {
    const startServerButton = this.element.querySelector(
      ".start-server-button",
    );
    const listenForServerButton = this.element.querySelector(
      ".find-server-button",
    );

    async function findServiceAndConnect() {
      const localId = await socketManager.discoverAndConnect();
      initPeerManager();
      this.appState.setLocalId(localId);
    }
    startServerButton.addEventListener("click", async () => {
      try {
        console.log("Button pressed, server should start now");
        await window.electronAPI.startServer();
        this.appState.setConnectionStatus("connected");
        await findServiceAndConnect();
      } catch (err) {
        console.error("Something went wrong in connecting to server: ", err);
      }
    });
    listenForServerButton.addEventListener("click", async () => {
      await findServiceAndConnect();
    });
  }

  getTemplate() {
    return `<div class ="connect-buttons-container">
      <button class="start-server-button ${this.serverStatus}">Start Server</button>
      <button class="find-server-button">Discover devices</button>
    </div>`;
  }

  update() {
    const startServerButton = this.element.querySelector(
      ".start-server-button",
    );
    startServerButton.className = `start-server-button ${this.serverStatus}`;
  }
}
