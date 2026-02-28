import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  computed,
  inject,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonSearchbar,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { TypeaheadItem } from '@models/type-head.model';
import { normalizeString } from '@utils/normalize-string';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  chevronBackOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { APP_TEXTS_TOKEN } from '@core/app-texts';
import { AppTexts } from '@core/app-texts';

@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancelSelection()">
            <ion-icon slot="icon-only" name="chevron-back-outline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ title() }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="confirmSelection()" [strong]="true">
            {{ texts.typeahead.done }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar (ionInput)="searchbarInput($event)"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list [inset]="true">
        @for (item of filteredList(); track item.value) {
          <ion-item
            [button]="true"
            (click)="toggleItem(item)"
            [detail]="false"
          >
            <ion-label>{{ item.text }}</ion-label>
            @if (item.value === selectedId()) {
              <ion-icon
                slot="end"
                name="checkmark-circle-outline"
                color="primary"
              />
            }
          </ion-item>
        } @empty {
          <ion-item>
            <ion-label>{{ texts.typeahead.noItemsAvailable }}</ion-label>
          </ion-item>
        }
      </ion-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeaheadComponent implements OnInit {
  readonly texts = inject<AppTexts>(APP_TEXTS_TOKEN);

  title = input<string>('Seleccionar');
  items = input<TypeaheadItem[]>([]);
  selectedItem = input<number>(0);

  selectionChange = output<TypeaheadItem| undefined>();
  selectionCancel = output<void>();

  textQuery = signal<string>('');
  private internalSelected = signal<TypeaheadItem|undefined>(undefined);

  filteredList = computed(() => {
    return this.items().filter(({ text }) =>
      normalizeString(text).includes(this.textQuery()),
    );
  });

  selectedId = computed(() => this.internalSelected()?.value ?? 0)
  constructor() {
    addIcons({ closeOutline, chevronBackOutline, checkmarkCircleOutline });
  }

  ngOnInit(): void {
    // by pass value input to internal state
    if (this.selectedItem()) {
      this.internalSelected.set(this.findSelectedElement(this.selectedItem()));
    }
  }
  toggleItem(newValue: TypeaheadItem): void {
    this.internalSelected.update((oldVal) => oldVal?.value === newValue.value ? undefined : newValue);
  }

  confirmSelection(): void {
    const hasSelected = this.internalSelected()
    this.selectionChange.emit(hasSelected);
  
  }

  cancelSelection(): void {
    this.selectionCancel.emit();
  }

  searchbarInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.textQuery.set(normalizeString(target?.value ?? ''));
  }

  findSelectedElement (selectedId: number): TypeaheadItem | undefined {
    return this.items().find(({ value  }) => value === selectedId)
  }

}
