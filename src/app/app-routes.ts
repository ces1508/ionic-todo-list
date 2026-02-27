import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/todo/todo.routes').then(m => m.routes)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];
