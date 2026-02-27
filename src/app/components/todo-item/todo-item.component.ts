import { Component, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline } from 'ionicons/icons';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-item>
      <ion-checkbox 
        [checked]="todo().completed" 
        (ionChange)="onToggle()"
        slot="start"
      />
      <div class="todo-content" (click)="onEdit()">
        <ion-label [class.completed]="todo().completed">
          <strong class="todo-title">{{ todo().title }}</strong>
          @if (todo().description) {
            <p class="todo-description">{{ todo().description }}</p>
          }
        </ion-label>
      </div>
      <ion-buttons slot="end">
        <ion-button (click)="onEdit()" color="primary">
          <ion-icon slot="icon-only" name="create-outline" />
        </ion-button>
        <ion-button (click)="onDelete()" color="danger">
          <ion-icon slot="icon-only" name="trash-outline" />
        </ion-button>
      </ion-buttons>
    </ion-item>
  `,
  styles: `
    .todo-content {
      flex: 1;
      cursor: pointer;
      padding: 4px 0;
    }

    .todo-title {
      font-size: 16px;
    }

    .todo-description {
      font-size: 13px;
      color: var(--ion-color-medium);
      margin-top: 4px;
      white-space: pre-wrap;
    }

    .completed {
      text-decoration: line-through;
      opacity: 0.6;
    }

    ion-checkbox {
      --checkbox-size: 24px;
    }
  `,
})
export class TodoItemComponent {
  todo = input.required<Todo>();

  toggleComplete = output<number>();
  deleteTodo = output<number>();
  editTodo = output<Todo>();

  constructor() {
    addIcons({ trashOutline, createOutline });
  }

  onToggle(): void {
    this.toggleComplete.emit(this.todo().id);
  }

  onDelete(): void {
    this.deleteTodo.emit(this.todo().id);
  }

  onEdit(): void {
    this.editTodo.emit(this.todo());
  }
}
