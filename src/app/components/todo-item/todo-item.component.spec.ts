import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { IonicModule } from '@ionic/angular';
import { Todo } from '@models/todo.model';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    completed: false,
    createdAt: new Date(),
    categoryId: 1,
    categoryName: 'Work',
    categoryColor: '#ff0000',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent, IonicModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('todo', mockTodo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleComplete when onToggle is called', () => {
    jest.spyOn(component.toggleComplete, 'emit');
    component.onToggle();
    expect(component.toggleComplete.emit).toHaveBeenCalledWith(1);
  });

  it('should emit deleteTodo when onDelete is called', () => {
    jest.spyOn(component.deleteTodo, 'emit');
    component.onDelete();
    expect(component.deleteTodo.emit).toHaveBeenCalledWith(1);
  });

  it('should emit editTodo when onEdit is called', () => {
    jest.spyOn(component.editTodo, 'emit');
    component.onEdit();
    expect(component.editTodo.emit).toHaveBeenCalledWith(mockTodo);
  });

  it('should display todo title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Todo');
  });
});
