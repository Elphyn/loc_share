import { io } from "socket.io-client";

export class SocketManager {
  constructor() {
    this.socket = null;
  }

  async discoverAndConnect() {
    const service = await window.electronAPI.getDiscoveredServices();

    return new Promise((resolve, reject) => {
      console.log("Service: ", service);

      this.socket = io(`http://${service.addresses[0]}:${service.port}`);

      this.socket.on("connect", () => {
        console.log("Socket connected");
        resolve(this.socket.id);
      });

      this.socket.on("error", (err) => {
        console.log("Error while connecting to socket server", err);
        reject(err);
      });
    });
  }
}
