import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { shareOutline } from 'ionicons/icons';
import { TodoService } from '@services/todo/todo.service';
import { ShareService } from '@services/share/share.service';
import { APP_TEXTS_TOKEN } from '@core/app-texts';
import { AppTexts } from '@core/app-texts';

@Component({
  selector: 'app-share-button',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-button
      (click)="share()"
      fill="outline"
      size="small"
      [disabled]="todos().length === 0"
    >
      <ion-icon slot="start" name="share-outline" />
      {{ texts.buttons.share }}
    </ion-button>
  `,
})
export class ShareButtonComponent {
  private readonly shareService = inject(ShareService);
  private readonly todoService = inject(TodoService);
  readonly texts = inject<AppTexts>(APP_TEXTS_TOKEN);

  todos = this.todoService.todos;

  constructor() {
    addIcons({ shareOutline });
  }

  async share(): Promise<void> {
    await this.shareService.shareAsCSV(this.todos());
  }
}
