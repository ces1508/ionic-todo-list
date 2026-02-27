import { Component, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-page-header',
  imports: [IonicModule],
  template: `
    <ion-header [translucent]="translucent()">
      <ion-toolbar style="background: red;">
        <ion-title>{{ title() }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="handleAddElement()">
            <ion-icon slot="icon-only" name="add" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
})
export class PageHeaderComponent {
  title = input<string>('');
  translucent = input<boolean>(true);
  addElement = output<void>();

  handleAddElement(): void {
    this.addElement.emit();
  }
}
