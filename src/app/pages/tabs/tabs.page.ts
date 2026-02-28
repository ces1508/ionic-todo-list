import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { folderOutline, listOutline } from 'ionicons/icons';
import { APP_TEXTS_TOKEN } from '@core/app-texts';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonicModule, RouterModule],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="todos">
          <ion-icon name="list-outline" />
          <ion-label>{{ texts.tabs.todos }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="categories">
          <ion-icon name="folder-outline" />
          <ion-label>{{ texts.tabs.categories }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  readonly texts = inject(APP_TEXTS_TOKEN);

  constructor() {
    addIcons({ folderOutline, listOutline });
  }
}
