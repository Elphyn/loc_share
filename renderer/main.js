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
const fileForm = document.getElementById("fileForm");
const fileInput = document.getElementById("fileInput");
const uploadedFiles = document.getElementById("uploaded-files");

const header = document.getElementById("header");

let socketManager = null;
let peerManager = null;
let fileMeta = null;
let fileChunks = [];

import { AppState } from "./appState.js";
import { ConnectionStatusBar } from "./components/ConnectionStatus.js";
export const appState = new AppState();

header.append(
  new ConnectionStatusBar(appState.state.connectionServer, appState).render(),
);

window.addEventListener("p2p-connected", () => {
  peerManager.on("data", (data) => {
    console.log("Received data, type: ", typeof data);
    console.log(data);

    try {
      // for whatever reason wrtc sends even strings as uint8array, don't forget
      const text = new TextDecoder().decode(data);
      const parsedData = JSON.parse(text);

      if (parsedData.type === "file-meta") {
        console.log("file-meta");
        fileMeta = parsedData;
        fileChunks = [];
      } else if (parsedData.type === "file-done") {
        console.log("File-done");
        const blob = new Blob(fileChunks, { type: fileMeta.filetype });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileMeta.filename;
        a.textContent = `Download ${fileMeta.filename}, size: ${blob.size}`;

        console.log("File collected: ", blob);
        uploadedFiles.append(a);
      }
    } catch (error) {
      fileChunks.push(data);
    }
  });
  console.log("setting up data-handle");
});

export function getPeerManager() {
  if (peerManager) {
    return peerManager;
  } else {
    console.error("No peerManager initialized yet");
  }
}

async function findServiceAndConnect() {
  socketManager = new SocketManager();
  appState.setLocalId(await socketManager.discoverAndConnect());
  peerManager = new PeerManager(socketManager);
}

button_host.addEventListener("click", async () => {
  try {
    console.log("button pressed, server should be starting now");
    await window.electronAPI.startServer();
    appState.setConnectionStatus("connected");
    await findServiceAndConnect();
    console.log("localId: ", appState.state.localId);
  } catch (err) {
    console.log("Something went wrong: ", err);
  }
});

button_update.addEventListener("click", async () => {
  await choosingSocketToConnect(list, appState.state.localId);
});

button_listener.addEventListener("click", async () => {
  await findServiceAndConnect();
});

fileForm.addEventListener("submit", async (e) => {
  console.log("sending file");
  e.preventDefault();

  const file = fileInput.files[0];

  const meta = JSON.stringify({
    type: "file-meta",
    filename: file.name,
    filetype: file.type,
  });

  peerManager.sendData(meta);

  let offset = 0;
  const chunkSize = 16 * 1024;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const buffer = await chunk.arrayBuffer();

    const uint8Array = new Uint8Array(buffer);
    peerManager.sendData(uint8Array);
    offset += chunkSize;
  }

  peerManager.sendData(
    JSON.stringify({
      type: "file-done",
    }),
  );
});
