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
  IonSelect,
  IonSelectOption,
  ModalController,
} from '@ionic/angular/standalone';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { map } from 'rxjs';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Todo, TodoFormData } from '@models/todo.model';
import { trimObjectValues } from '@utils/trim.util';
import { TypeaheadItem } from '@models/type-head.model';
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
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    FormsModule,
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

  selectedCategoryId: number | null = null;
  selectReady = signal<boolean>(false);

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
      this.selectedCategoryId = this.initialData.categoryId ?? null;
      this.fillForm();
    } else {
      this.resetFormValues();
    }
    // Hack: para evitar que select bloquie el renderizado de elementos
    // hermanos
    setTimeout(() => {
      this.selectReady.set(true);
    }, 100);
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.closeModal(trimObjectValues(this.todoForm.value) as TodoFormData);
    }
  }

  onCategorySelection(event: any): void {
    const categoryId = event.detail.value;
    this.todoForm.patchValue({ categoryId: categoryId || null });
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
  }

  private resetFormValues(): void {
    this.todoForm.setValue({
      title: '',
      description: '',
      categoryId: null,
    });
  }
}
