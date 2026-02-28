import { InjectionToken } from '@angular/core';

export const APP_TEXTS = {
  // Tabs
  tabs: {
    todos: 'Tareas',
    categories: 'Categorías',
  },
  // Page Titles
  pages: {
    todoList: 'Lista de Tareas',
    categories: 'Categorías',
  },
  // Buttons
  buttons: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    create: 'Crear',
    clear: 'Limpiar',
    export: 'Exportar',
    clearAll: 'Limpiar todo',
    addCategory: 'Agregar Categoría',
    share: 'Compartir',
  },
  // Filters
  filters: {
    all: 'Todas',
    active: 'Activas',
    completed: 'Completadas',
  },
  // Form Labels
  form: {
    title: 'Título',
    titleRequired: 'Título *',
    description: 'Descripción',
    descriptionOptional: 'Descripción (opcional)',
    category: 'Categoría',
    categoryRequired: 'Categoría *',
    name: 'Nombre',
    nameRequired: 'Nombre *',
    optional: 'opcional',
    required: 'obligatorio',
  },
  // Placeholders
  placeholders: {
    whatNeedsToBeDone: '¿Qué necesitas hacer?',
    addMoreDetails: 'Agregar más detalles...',
    categoryName: 'Nombre de categoría',
    selectCategory: 'Seleccionar Categoría',
    filterByCategory: 'Filtrar por categoría',
  },
  // Empty States
  empty: {
    noTodos: 'No hay tareas',
    tapToAddFirstTodo: 'Toca + para agregar tu primera tarea',
    noCategories: 'No hay categorías',
    tapToAddFirstCategory: 'Toca + para agregar tu primera categoría',
  },
  // Alerts
  alerts: {
    noCategories: 'Sin Categorías',
    createCategoryFirst: 'Por favor crea al menos una categoría antes de agregar tareas.',
    createCategory: 'Crear Categoría',
  },
  // Footer
  footer: {
    completed: 'completadas',
    clearAll: 'Limpiar todo',
  },
  // Share
  share: {
    exportTodos: 'Exportar Tareas',
    exportingTodos: 'Exportando',
  },
  // Form Titles
  formTitles: {
    newTodo: 'Nueva Tarea',
    editTodo: 'Editar Tarea',
    newCategory: 'Nueva Categoría',
    editCategory: 'Editar Categoría',
  },
  // Typeahead
  typeahead: {
    select: 'Seleccionar',
    selectCategory: 'Seleccionar Categoría',
    done: 'Listo',
    noItemsAvailable: 'No hay elementos disponibles',
  },
} as const;

export type AppTexts = typeof APP_TEXTS;

export const APP_TEXTS_TOKEN = new InjectionToken<AppTexts>('APP_TEXTS', {
  factory: () => APP_TEXTS,
});
