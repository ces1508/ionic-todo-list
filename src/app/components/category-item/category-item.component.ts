import { Component, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline } from 'ionicons/icons';
import { Category } from '@models/category.model';
import { DotColorComponent } from '@components/category-color/dot-color.component';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [IonicModule, DotColorComponent],
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent {
  category = input.required<Category>();

  deleteCategory = output<number>();
  editCategory = output<Category>();

  constructor() {
    addIcons({ trashOutline, createOutline });
  }

  onDelete(): void {
    this.deleteCategory.emit(this.category().id);
  }

  onEdit(): void {
    this.editCategory.emit(this.category());
  }
}
