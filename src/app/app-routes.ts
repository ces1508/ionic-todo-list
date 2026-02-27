import { Routes } from '@angular/router';
import { TabsPage } from './pages/tabs/tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'todos',
        loadComponent: () =>
          import('./pages/todo/todo.page').then((m) => m.TodoPage),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories.page').then(
            (m) => m.CategoriesPage,
          ),
      },
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
