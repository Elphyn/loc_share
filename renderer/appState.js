export class AppState {
  constructor() {
    this.state = {
      localId: null,
      connectionServer: "disconnected",
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
    this.emit("localId-assigned", id);
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
}
