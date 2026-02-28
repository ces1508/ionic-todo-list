import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-button-icon',
  imports: [IonButton, IonIcon],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-button
      (click)="iconClick.emit()"
      [fill]="fill()"
      [disabled]="disabled()"
    >
      <ion-icon [slot]="iconSlot()" [name]="iconName()" />
    </ion-button>
  `,
})
export class ButtonIconComponent {
  iconName = input.required();
  disabled = input<boolean>(false);
  iconSlot = input<'start' | 'end' | 'icon-only'>('icon-only');
  fill = input<'clear' | 'outline' | 'solid'>('clear');
  iconClick = output<void>();
}
