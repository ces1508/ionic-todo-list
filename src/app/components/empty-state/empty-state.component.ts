import { Component, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonicModule],
  template: `
    <div class="empty-container">
      <ion-icon [name]="icon()" class="empty-icon" />
      @if (title()) {
        <h2 class="empty-title">{{ title() }}</h2>
      }
      @if (message()) {
        <p class="empty-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      color: var(--ion-color-medium);
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--ion-color-dark);
      margin: 0 0 8px;
    }

    .empty-message {
      font-size: 14px;
      color: var(--ion-color-medium);
      margin: 0;
      max-width: 280px;
    }
  `,
})
export class EmptyStateComponent {
  title = input<string>('');
  message = input<string>('');
  icon = input<string>('document-text-outline');

  constructor() {
    addIcons({ documentTextOutline });
  }
}
