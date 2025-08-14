import { io } from "socket.io-client";
import { appState } from "./main";

export class SocketManager {
  constructor() {
    this.socket = null;
  }

  async discoverAndConnect() {
    let service = null;
    try {
      console.log("Looking for server...");
      service = await window.electronAPI.getDiscoveredServices();
      console.log("Found a server: ", service);
    } catch (err) {
      console.error("Failed to find a server, err: ", err);
    }

    return new Promise((resolve, reject) => {
      this.socket = io(`http://${service.addresses[0]}:${service.port}`);

      this.socket.on("connect", () => {
        console.log("Socket connected");
        resolve(this.socket.id);
      });

      this.socket.on("socket:connected", (socketId) => {
        appState.addSocket(socketId);
      });

      this.socket.on("socket:disconnected", (socketId) => {
        appState.removeSocket(socketId);
      });

      this.socket.on("error", (err) => {
        console.log("Error while connecting to socket server", err);
        reject(err);
      });
    });
  }
}

export const socketManager = new SocketManager();
