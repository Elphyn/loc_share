import { AppState } from "./appState.js";
import { ConnectionStatusBar } from "./components/ConnectionStatus.js";
import { DiscoverDevices } from "./components/DiscoverDevices.js";
import global from "global";
import * as process from "process";
import { ConnectedSockets } from "./components/ListConnections.js";
import { DropZone } from "./components/DropZone.js";
import { FileReceiver } from "./components/FileReceiver.js";

global.process = process;

const header = document.getElementById("header");
const serverSection = document.getElementById("server-section");
export const appState = new AppState();

const statusBar = new ConnectionStatusBar(appState);
statusBar.mount(header);

const discoveryButtons = new DiscoverDevices(appState);
discoveryButtons.mount(serverSection);

const connectionOptions = document.getElementById("connection-options");
const connections = new ConnectedSockets(appState);
connections.mount(connectionOptions);

const fileSection = document.createElement("div");
fileSection.className = "file-section";
document.querySelector(".main-content").appendChild(fileSection);

const dropZone = new DropZone(appState);
dropZone.mount(fileSection);

const fileReceiver = new FileReceiver(appState);
fileReceiver.mount(fileSection);

// console.log("Right before setting up listener");
// window.electronAPI.onSocketConnected((socketId) => {
//   console.log("Recieved socketId from backend");
//   appState.addSocket(socketId);
// });
// window.electronAPI.onSocketDisconnected((socketId) => {
//   console.log("Received disconnected socket from backend");
//   appState.removeSocket(socketId);
// });

const unsubscribePeerStatus = appState.subscribe(
  ".state.peerStatus",
  (status) => {
    if (status === "connected") {
      console.log("p2p connected");
    }
  },
);
// window.addEventListener("p2p-connected", () => {
//   peerManager.on("data", (data) => {
//     console.log("Received data, type: ", typeof data);
//     console.log(data);
//
//     try {
//       // for whatever reason wrtc sends even strings as uint8array, don't forget
//       const text = new TextDecoder().decode(data);
//       const parsedData = JSON.parse(text);
//
//       if (parsedData.type === "file-meta") {
//         console.log("file-meta");
//         fileMeta = parsedData;
//         fileChunks = [];
//       } else if (parsedData.type === "file-done") {
//         console.log("File-done");
//         const blob = new Blob(fileChunks, { type: fileMeta.filetype });
//         const url = URL.createObjectURL(blob);
//
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = fileMeta.filename;
//         a.textContent = `Download ${fileMeta.filename}, size: ${blob.size}`;
//
//         console.log("File collected: ", blob);
//         uploadedFiles.append(a);
//       }
//     } catch (error) {
//       fileChunks.push(data);
//     }
//   });
//   console.log("setting up data-handle");
// });
//
// button_update.addEventListener("click", async () => {
//   await choosingSocketToConnect(list, appState.state.localId);
// });
//
// button_listener.addEventListener("click", async () => {
//   await findServiceAndConnect();
// });
//
// fileForm.addEventListener("submit", async (e) => {
//   console.log("sending file");
//   e.preventDefault();
//
//   const file = fileInput.files[0];
//
//   const meta = JSON.stringify({
//     type: "file-meta",
//     filename: file.name,
//     filetype: file.type,
//   });
//
//   peerManager.sendData(meta);
//
//   let offset = 0;
//   const chunkSize = 16 * 1024;
//
//   while (offset < file.size) {
//     const chunk = file.slice(offset, offset + chunkSize);
//     const buffer = await chunk.arrayBuffer();
//
//     const uint8Array = new Uint8Array(buffer);
//     peerManager.sendData(uint8Array);
//     offset += chunkSize;
//   }
//
//   peerManager.sendData(
//     JSON.stringify({
//       type: "file-done",
//     }),
//   );
// });
