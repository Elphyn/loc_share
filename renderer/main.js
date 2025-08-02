import global from "global";
import * as process from "process";
global.process = process;

import { choosingSocketToConnect } from "./listing_connections.js";
import { SocketManager } from "./socketManager.js";
import { PeerManager } from "./peerManager.js";

const button_update = document.getElementById("update");
const button_host = document.getElementById("start-server");
const list = document.getElementById("connections");
const button_listener = document.getElementById("allow-connection");

let socketManager = null;
let peerManager = null;
let localId = null;

export function getPeerManager() {
  if (peerManager) {
    return peerManager;
  } else {
    console.error("No peerManager initialized yet");
  }
}

async function findServiceAndConnect() {
  socketManager = new SocketManager();
  localId = await socketManager.discoverAndConnect();
  peerManager = new PeerManager(socketManager);
}

button_host.addEventListener("click", async () => {
  try {
    console.log("button pressed, server should be starting now");
    await window.electronAPI.startServer();

    await findServiceAndConnect();
    console.log("localId: ", localId);
  } catch (err) {
    console.log("Something went wrong: ", err);
  }
});

button_update.addEventListener("click", async () => {
  await choosingSocketToConnect(list, localId);
});

button_listener.addEventListener("click", async () => {
  await findServiceAndConnect();
});
