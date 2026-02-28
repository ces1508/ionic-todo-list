import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  effect,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CategoryService } from '@services/category/category.service';
import { RemoteConfigService } from '@services/remote-config/remote-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, RouterOutlet],
})
export class AppComponent implements OnInit {
  categoryService = inject(CategoryService);
  remoteConfig = inject(RemoteConfigService);

  ngOnInit(): void {
    this.getCategories();
  }

  /**
   * Se llama el listado de categorias para poder
   * cargar el signal de hasCategories el cual valida
   * si ya existe alguna categoria previamente a crear un tarea
   *
   * se opta por este enfoque para mejorar la ux, ya que si ponemos un
   * guarda que no permita ingresar a la vista de tareas sin que previamente se haya creado
   * alguna categoria el usuario puede sentirse perdido porque su intencion es crear un todo pero
   * se redirecciona automaticamente a la vista de categorias
   *
   */
  async getCategories() {
    await this.categoryService.loadCategories();
  }
}
