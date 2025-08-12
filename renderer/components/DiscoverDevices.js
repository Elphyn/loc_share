import { initPeerManager } from "../peerManager";
import { socketManager } from "../socketManager";
import { BaseComponent } from "./BaseComponent";

export class DiscoverDevices extends BaseComponent {
  constructor(appState) {
    super(appState);
    this.serverStatus = this.appState.state.serverStatus;
    this.unsubscribe = this.handleChange();
    this.element = null;
  }

  handleChange() {
    return this.appState.subscribe("server-connection", (newData) => {
      this.serverStatus = newData;
      this.update();
    });
  }
  addEventListeners() {
    const startServerButton = this.element.querySelector(
      "#start-server-button",
    );
    const listenForServerButton = this.element.querySelector(
      "#discover-server-button",
    );

    const findServiceAndConnect = async () => {
      if (!this.appState.state.localId) {
        console.log("connecting to somewhere...");
        const localId = await socketManager.discoverAndConnect();
        initPeerManager();
        console.log("setting localId after connect to: ", localId);
        this.appState.setLocalId(localId);
      }
    };
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
    return `<div class ="server-controls">
      <button id="start-server-button" class="server-btn ${this.serverStatus}">Start Server</button>
      <button id="discover-server-button" class="server-btn">Discover devices</button>
    </div>`;
  }

  update() {
    const startServerButton = this.element.querySelector(
      "#start-server-button",
    );
    const discoverServerButton = this.element.querySelector(
      "#discover-server-button",
    );
    if (this.serverStatus === "connected") {
      startServerButton.disabled = true;
      discoverServerButton.disabled = true;
    }
  }
  mount(parent) {
    this.element = this.createElement();
    this.addEventListeners();
    parent.append(this.element);
  }
}
