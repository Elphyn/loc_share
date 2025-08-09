import EventEmitter from "events";
import SimplePeer from "simple-peer";
import { socketManager } from "./socketManager";
import { appState } from "./main";

export class PeerManager extends EventEmitter {
  constructor() {
    super();

    this.socket = socketManager.socket;
    this.peer = null;
    this.remoteId = null;

    this._setupSocketListeners();
  }

  _setupSocketListeners() {
    this.socket.on("signal", ({ from, signal }) => {
      console.log("Received signal, from :", signal);
      if (!this.remoteId) {
        this.remoteId = from;
      }

      if (!this.peer) {
        this._createPeer(false);
      }

      try {
        this.peer.signal(signal);
      } catch (err) {
        console.log("Signaling failed: ", err);
      }
    });
  }

  _createPeer(isInitiator) {
    this.peer = new SimplePeer({ initiator: isInitiator, trickle: false });

    this.peer.on("signal", (data) => {
      if (!this.remoteId) {
        console.warn("No RemoteID in signaling");
        return;
      }
      this.socket.emit("signal", {
        to: this.remoteId,
        signal: data,
      });
    });

    this.peer.on("connect", () => {
      console.log("P2P connected!");
      appState.setPeerStatus("connected");
    });

    this.peer.on("error", (err) => {
      console.log("Failed to connect p2p: ", err);
    });

    this.peer.on("data", (data) => {
      console.log("Received data: ", data);
      this.emit("data", data);
    });
  }

  connect(remoteId) {
    if (this.peer) throw new Error("Already connected");
    this.remoteId = remoteId;
    this._createPeer(true);
  }

  sendData(data) {
    this.peer.send(data);
  }
}

export let peerManager = null;

export function initPeerManager() {
  if (!peerManager) {
    peerManager = new PeerManager();
  }
}
