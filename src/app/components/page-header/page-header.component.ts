import { Component, input, output } from '@angular/core';
import { ButtonIconComponent } from '@components/button-icon/button-icon.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-page-header',
  imports: [IonicModule, ButtonIconComponent],
  template: `
    <ion-header [translucent]="translucent()" collapse="condense">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ng-content select="[left]"></ng-content>
        </ion-buttons>
        <ion-title>{{ title() }}</ion-title>
        <ion-buttons slot="end">
          <app-button-icon (iconClick)="handleAddElement()" iconName="add" />
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ng-content />
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
