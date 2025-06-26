import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateCheckService {

  private snackBar = inject(MatSnackBar);
  private swUpdate = inject(SwUpdate);

  messages = signal<string[]>([]);

  listenForAppUpdates(): void {
    this.messages.update(messages => [...messages, `Listen for app updates...`]);

    this.swUpdate.versionUpdates.subscribe(evt => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          this.messages.update(messages => [...messages, `Downloading new app version: ${evt.version.hash}`]);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          this.messages.update(messages => [...messages, `Current app version: ${evt.currentVersion.hash}`]);

          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          this.messages.update(messages => [...messages, `New app version ready for use: ${evt.latestVersion.hash}`]);

          this.snackBar
            .open('Update verfügbar!', 'Aktualisieren', { duration: 30_000 })
            .onAction()
            .subscribe(() => {
              window.location.reload();
            });

          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          this.messages.update(messages => [...messages, `Failed to install app version '${evt.version.hash}': ${evt.error}`]);
          break;
      }
    });
  }
}
