import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  ModalController,
} from '@ionic/angular/standalone';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Todo, TodoFormData } from '@models/todo.model';
import { trimObjectValues } from '@utils/trim.util';
import { TypeaheadItem } from '@models/type-head.model';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { APP_TEXTS_TOKEN } from '@core/app-texts';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    AutocompleteComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  readonly texts = inject(APP_TEXTS_TOKEN);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: Todo | null = null;
  @Input() categories: TypeaheadItem[] = [];

  todoForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    description: new FormControl<string>('', [Validators.maxLength(255)]),
    categoryId: new FormControl<number | null>(null, [Validators.required]),
  });

  readonly isValid = toSignal(
    this.todoForm.statusChanges.pipe(map(() => this.todoForm.valid)),
    { initialValue: false },
  );

  selectedCategory = signal<TypeaheadItem | undefined>(undefined);

  get formTitle(): string {
    return this.mode === 'create'
      ? this.texts.formTitles.newTodo
      : this.texts.formTitles.editTodo;
  }

  constructor() {
    addIcons({ closeOutline });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.initialData) {
      this.fillForm();
    } else {
      this.resetFormValues();
    }
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.closeModal(trimObjectValues(this.todoForm.value) as TodoFormData);
    }
  }

  onCategorySelection(item: TypeaheadItem | undefined): void {
    this.selectedCategory.set(item);
    this.todoForm.patchValue({ categoryId: item?.value || null });
  }

  protected closeModal(formData: TodoFormData | undefined = undefined): void {
    this.modalController.dismiss(formData, formData ? 'submit' : 'cancel');
  }

  private fillForm(): void {
    const { title, description, categoryId } = this.initialData!;
    
    this.todoForm.setValue({
      title,
      description: description || '',
      categoryId: categoryId ?? null,
    });

    // Establecer categoría seleccionada
    if (categoryId) {
      const category = this.categories.find(c => c.value === categoryId);
      this.selectedCategory.set(category);
    }
  }

  private resetFormValues(): void {
    this.todoForm.setValue({
      title: '',
      description: '',
      categoryId: null,
    });
    this.selectedCategory.set(undefined);
  }
}