import { Component, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline } from 'ionicons/icons';
import { Todo } from '@models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  categoryColor = input<string>('');

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
