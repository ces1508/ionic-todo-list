import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'app-dot-color',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="color-indicator" [style.background-color]="color()"></div>
  `
})
export class DotColorComponent {
  color = input.required<string>()
}