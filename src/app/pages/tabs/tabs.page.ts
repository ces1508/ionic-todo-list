import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { folderOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonicModule, RouterModule],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="todos">
          <ion-icon name="list-outline" />
          <ion-label>Todos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="categories">
          <ion-icon name="folder-outline" />
          <ion-label>Categories</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {

  constructor() {
    addIcons({ folderOutline, listOutline });
  }
}

