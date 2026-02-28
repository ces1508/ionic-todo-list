import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button-icon',
  imports: [IonicModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-button (click)="iconClick.emit()" fill="clear" [disabled]="disabled()">
      <ion-icon [slot]="iconSlot()" [name]="iconName()" />
    </ion-button>
  `,
})
export class ButtonIconComponent {
  iconName = input.required();
  disabled = input<boolean>(false);
  iconSlot = input<'start' | 'end' | 'icon-only'>('icon-only')
  fill = input<'clear' | 'outline' | 'solid'>('clear')
  iconClick = output<void>();
}
