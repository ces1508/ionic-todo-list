import { Component, computed, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { TypeaheadComponent } from '@components/typeahead/typeahead.component';
import { IonModal, IonSearchbar } from '@ionic/angular/standalone';
import { TypeaheadItem } from '@models/type-head.model';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [IonSearchbar, IonModal, TypeaheadComponent],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  initalData = input<TypeaheadItem['value'] | undefined>(undefined);
  placeHolder = input.required<string>();
  typeaheadTitle = input<string>('Seleccionar');
  items = input.required<TypeaheadItem[]>();
  changeItem = output<TypeaheadItem | undefined>();

  @ViewChild('categoryModal') categoryModal!: IonModal;

  selectedItem = signal<TypeaheadItem | undefined>(undefined);
  selectedText = computed(() => {
    if (!this.selectedItem()) {
      return this.placeHolder();
    }
    return this.selectedItem()?.text;
  });

  ngOnInit(): void {
    const intialId = this.initalData();
    if (intialId) {
      this.selectedItem.set(this.findSelected(intialId));
    }
  }

  onCategorySelection(item: TypeaheadItem | undefined): void {
    this.selectedItem.set(item);
    this.categoryModal.dismiss();
    this.changeItem.emit(item);
  }

  onCategoryCancel(): void {
    this.categoryModal.dismiss();
  }

  private findSelected(selectedValue: number): TypeaheadItem | undefined {
    return this.items().find(({ value }) => value === selectedValue);
  }
}
