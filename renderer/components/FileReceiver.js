import { BaseComponent } from "./BaseComponent";
import { peerManager } from "../peerManager";

export class FileReceiver extends BaseComponent {
  constructor(appState) {
    super(appState);
    this.fileMeta = null;
    this.fileChunks = [];
    this.receivedFiles = [];

    this.setupFileReceiver();
  }

  setupFileReceiver() {
    this.unsubscribe = this.appState.subscribe(
      ".state.peerStatus",
      (status) => {
        if (status === "connected" && peerManager) {
          peerManager.on("data", (data) => this.handleIncomingData(data));
        }
      },
    );
  }

  handleIncomingData(data) {
    try {
      const text = new TextDecoder().decode(data);
      const parsedData = JSON.parse(text);

      if (parsedData.type === "file-meta") {
        console.log("Receiving file:", parsedData.filename);
        this.fileMeta = parsedData;
        this.fileChunks = [];
        this.showReceivingIndicator();
      } else if (parsedData.type === "file-done") {
        console.log("File transfer complete");
        this.completeFileReceive();
      }
    } catch (error) {
      this.fileChunks.push(data);
    }
  }

  showReceivingIndicator() {
    const container = this.element.querySelector(".received-files");
    const indicator = document.createElement("div");
    indicator.className = "receiving-indicator";
    indicator.innerHTML = `
      <div class="file-info">
        <span>📥 Receiving: ${this.fileMeta.filename}</span>
      </div>
    `;
    container.appendChild(indicator);
  }

  completeFileReceive() {
    if (!this.fileMeta || !this.fileChunks.length) return;

    const blob = new Blob(this.fileChunks, { type: this.fileMeta.filetype });
    const url = URL.createObjectURL(blob);

    const fileItem = {
      name: this.fileMeta.filename,
      size: blob.size,
      url: url,
      type: this.fileMeta.filetype,
    };

    this.receivedFiles.push(fileItem);
    this.updateFilesList();

    this.fileMeta = null;
    this.fileChunks = [];

    const indicator = this.element.querySelector(".receiving-indicator");
    if (indicator) indicator.remove();
  }

  updateFilesList() {
    const container = this.element.querySelector(".received-files");

    // Clear ALL content first (including "no files" message)
    container.innerHTML = "";

    // If no files, show the "no files" message
    if (this.receivedFiles.length === 0) {
      container.innerHTML = '<div class="no-files">No files received yet</div>';
      return;
    }

    // Add all received files
    this.receivedFiles.forEach((file) => {
      const fileElement = document.createElement("div");
      fileElement.className = "file-item";
      fileElement.innerHTML = `
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${this.formatFileSize(file.size)}</div>
        </div>
        <button class="download-btn" data-url="${file.url}" data-name="${file.name}">
          Download
        </button>
      `;

      // Add download functionality
      const downloadBtn = fileElement.querySelector(".download-btn");
      downloadBtn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        a.click();
      });

      container.appendChild(fileElement);
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  getTemplate() {
    return `
      <div class="file-receiver">
        <h3>Received Files</h3>
        <div class="received-files">
          <div class="no-files">No files received yet</div>
        </div>
      </div>
    `;
  }

  mount(parent) {
    this.element = this.createElement();
    parent.append(this.element);
  }

  destroy() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.element) this.element.remove();

    // Clean up object URLs
    this.receivedFiles.forEach((file) => {
      if (file.url) URL.revokeObjectURL(file.url);
    });
  }
}
