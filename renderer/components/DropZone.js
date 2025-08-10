import { BaseComponent } from "./BaseComponent";
import { peerManager } from "../peerManager";

export class DropZone extends BaseComponent {
  constructor(appState) {
    super(appState);
    this.isConnected = false;

    // Listen for peer connection status
    this.unsubscribe = this.appState.subscribe(
      ".state.peerStatus",
      (status) => {
        this.isConnected = status === "connected";
        this.updateVisibility();
      },
    );
  }

  getTemplate() {
    return `
      <div class="drop-zone ${this.isConnected ? "active" : "inactive"}">
        <div class="drop-zone-content">
          <div class="drop-zone-text">
            ${this.isConnected ? "Drop files here or click to select" : "Connect to a device to share files"}
          </div>
          <input type="file" id="fileInput" style="display: none;" multiple ${this.isConnected ? "" : "disabled"}>
        </div>
      </div>
    `;
  }

  updateVisibility() {
    if (!this.element) return;
    const dropZone = this.element.querySelector(".drop-zone");
    const text = this.element.querySelector(".drop-zone-text");
    const input = this.element.querySelector("#fileInput");

    dropZone.className = `drop-zone ${this.isConnected ? "active" : "inactive"}`;
    text.textContent = this.isConnected
      ? "Drop files here or click to select"
      : "Connect to a device to share files";
    input.disabled = !this.isConnected;
  }

  addEventListeners() {
    const dropZone = this.element.querySelector(".drop-zone");
    const fileInput = this.element.querySelector("#fileInput");

    dropZone.addEventListener("click", () => {
      if (this.isConnected) {
        fileInput.click();
      }
    });

    fileInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => this.sendFile(file));
    });

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (this.isConnected) {
        dropZone.classList.add("drag-over");
      }
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");

      if (!this.isConnected) return;

      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => this.sendFile(file));
    });
  }

  async sendFile(file) {
    if (!peerManager || !this.isConnected) return;

    console.log("Sending file:", file.name);

    // Send file metadata
    const meta = JSON.stringify({
      type: "file-meta",
      filename: file.name,
      filetype: file.type,
      size: file.size,
    });
    peerManager.sendData(meta);

    // Send file in chunks
    let offset = 0;
    const chunkSize = 16 * 1024;

    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const buffer = await chunk.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      peerManager.sendData(uint8Array);
      offset += chunkSize;
    }

    // Signal file completion
    peerManager.sendData(JSON.stringify({ type: "file-done" }));
  }

  mount(parent) {
    this.element = this.createElement();
    this.addEventListeners();
    parent.append(this.element);
  }

  destroy() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.element) this.element.remove();
  }
}
