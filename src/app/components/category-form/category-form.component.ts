import { Component, output, Input, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Category, CategoryFormData } from '@models/category.model';
import { CATEGORY_COLORS } from '@models/category.model';
import { APP_TEXTS_TOKEN } from '@core/app-texts';
import { AppTexts } from '@core/app-texts';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  readonly texts = inject<AppTexts>(APP_TEXTS_TOKEN);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: Category | null = null;

  categoryForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    color: new FormControl<string>(''),
  });

  readonly colors = CATEGORY_COLORS;

  readonly isValid = toSignal(
    this.categoryForm.statusChanges.pipe(map(() => this.categoryForm.valid)),
    { initialValue: false }
  );

  get formTitle(): string {
    return this.mode === 'create' 
      ? this.texts.formTitles.newCategory 
      : this.texts.formTitles.editCategory;
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
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      this.closeModal({
        name: formValue.name!.trim(),
        color: formValue.color || this.chooseRandomColor(),
      });
    }
  }

  protected closeModal(formData: CategoryFormData | undefined = undefined): void {
    this.modalController.dismiss(formData, formData ? 'submit' : 'cancel');
  }

   private chooseRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * CATEGORY_COLORS.length);
    return CATEGORY_COLORS[randomIndex];
  }

  private fillForm(): void {
    const { name, color } = this.initialData!;
    this.categoryForm.setValue({
      name,
      color: color || '',
    });
  }

  private resetFormValues(): void {
    // when creating a new category start with a random color
    this.categoryForm.setValue({
      name: '',
      color: this.chooseRandomColor(),
    });
  }
}
