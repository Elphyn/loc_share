export class AppState {
  constructor() {
    this.state = {
      localId: null,
      connectionServer: "disconnected",

      connectedSockets: [],
    };
    this.listeners = new Map();
  }
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => callback(data));
  }
  setLocalId(id) {
    this.state.localId = id;
    this.emit(".state.localId", id);
  }
  getLocalId() {
    return this.state.localId;
  }
  setConnectionStatus(status) {
    this.state.connectionServer = status;
    this.emit("server-connection", status);
  }
  getServerStatus() {
    return this.connectionServer;
  }
  addSocket(socketId) {
    console.log("New socket connected: ", socketId);
    this.state.connectedSockets.push(socketId);
    console.log("connected sockets: ", this.state.connectedSockets);
    this.emit(".state.connectedSockets", socketId);
  }
}
