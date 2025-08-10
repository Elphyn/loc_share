import { BaseComponent } from "./BaseComponent";

export class DropZone extends BaseComponent {
  constructor(appState) {
    super(appState);

    this.unsubscribe = this.appState.subscribe(".stae.peerStatus", (status) => {
      this.handleChanges(status);
    });
  }

  getTemplate() {
    return `<div class="drop-zone">
    <div class="drop-zone-text">Click to select files or drag & drop</div>
    <input type="file" id="fileInput" style="display: none;" multiple>
</div>`;
  }
}
