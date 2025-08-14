import { initPeerManager } from "../peerManager";
import { socketManager } from "../socketManager";
import { BaseComponent } from "./BaseComponent";

export class DiscoverDevices extends BaseComponent {
  constructor(appState) {
    super(appState);
    this.serverStatus = this.appState.state.connectionServer;
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

    const handleClick = async () => {
      if (this.serverStatus === "disconnected") {
        try {
          console.log("Starting a server");
          await window.electronAPI.startServer();
          console.log("Server started");
          await findServiceAndConnect();
          this.appState.setConnectionStatus("connected");
        } catch (err) {
          console.log("Failed to start the server");
        }
      } else {
        try {
          console.log("Stopping server");
          await window.electronAPI.stopServer();
          console.log("Server stopped");
          this.appState.setConnectionStatus("disconnected");
          this.appState.setLocalId(null);
          socketManager.socket = null;
        } catch (err) {
          console.log("Failed to stop the server");
        }
      }
    };

    // startServerButton.removeEventListener("click", handleClick);
    // listenForServerButton.removeEventListener("click");

    const findServiceAndConnect = async () => {
      if (!this.appState.state.localId) {
        console.log("connecting to somewhere...");
        const localId = await socketManager.discoverAndConnect();
        initPeerManager();
        console.log("setting localId after connect to: ", localId);
        this.appState.setLocalId(localId);
      }
    };

    startServerButton.addEventListener("click", handleClick);

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
      startServerButton.textContent = "Stop Server";
      // now we need to reattach eventListener for click
      // this.addEventListeners();
    } else {
      startServerButton.textContent = "Start Server";
      // this.addEventListeners();
    }

    // if (this.serverStatus === "connected") {
    //   startServerButton.disabled = true;
    //   discoverServerButton.disabled = true;
    // }
  }
  mount(parent) {
    this.element = this.createElement();
    this.addEventListeners();
    parent.append(this.element);
  }
}
