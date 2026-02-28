import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryItemComponent } from './category-item.component';
import { IonicModule } from '@ionic/angular';
import { Category } from '@models/category.model';
import { DotColorComponent } from '@components/category-color/dot-color.component';

describe('CategoryItemComponent', () => {
  let component: CategoryItemComponent;
  let fixture: ComponentFixture<CategoryItemComponent>;

  const mockCategory: Category = {
    id: 1,
    name: 'Work',
    color: '#ff0000',
    isActive: 1,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryItemComponent, IonicModule, DotColorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('category', mockCategory);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteCategory when onDelete is called', () => {
    jest.spyOn(component.deleteCategory, 'emit');
    component.onDelete();
    expect(component.deleteCategory.emit).toHaveBeenCalledWith(1);
  });

  it('should emit editCategory when onEdit is called', () => {
    jest.spyOn(component.editCategory, 'emit');
    component.onEdit();
    expect(component.editCategory.emit).toHaveBeenCalledWith(mockCategory);
  });

  it('should display category name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Work');
  });
});
