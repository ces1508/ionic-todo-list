import { Component, output, Input, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Todo, TodoFormData } from '../../models/todo.model';
import { trimObjectValues } from '../../utils/trim.util';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent implements OnInit {
  modalController = inject(ModalController);
  @Input() mode : 'create' | 'edit' = 'create';
  @Input() initialData: Todo | null = null;

  todoForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl<string>('', [Validators.maxLength(255)]),
  });


  get formTitle(): string {
    return this.mode === 'create' ? 'New Todo' : 'Edit Todo';
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

  protected closeModal(formData:TodoFormData | undefined = undefined): void {
    this.modalController.dismiss(formData, formData ? 'submit' : 'cancel');
  }

  private fillForm(): void {
    const { title, description } = this.initialData!;
    this.todoForm.setValue({
      title,
      description: description || '',
    });
  }

  private resetFormValues(): void {
    this.todoForm.setValue({
      title: '',
      description: '',
    });
  }

}
