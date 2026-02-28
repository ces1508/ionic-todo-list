import { APP_TEXTS, APP_TEXTS_TOKEN, AppTexts } from './app-texts';

describe('app-texts', () => {
  describe('APP_TEXTS', () => {
    it('should have tabs translations', () => {
      expect(APP_TEXTS.tabs.todos).toBe('Tareas');
      expect(APP_TEXTS.tabs.categories).toBe('Categorías');
    });

    it('should have page titles', () => {
      expect(APP_TEXTS.pages.todoList).toBe('Lista de Tareas');
      expect(APP_TEXTS.pages.categories).toBe('Categorías');
    });

    it('should have button translations', () => {
      expect(APP_TEXTS.buttons.save).toBe('Guardar');
      expect(APP_TEXTS.buttons.cancel).toBe('Cancelar');
      expect(APP_TEXTS.buttons.delete).toBe('Eliminar');
      expect(APP_TEXTS.buttons.edit).toBe('Editar');
      expect(APP_TEXTS.buttons.add).toBe('Agregar');
    });

    it('should have filter translations', () => {
      expect(APP_TEXTS.filters.all).toBe('Todas');
      expect(APP_TEXTS.filters.active).toBe('Activas');
      expect(APP_TEXTS.filters.completed).toBe('Completadas');
    });

    it('should have form translations', () => {
      expect(APP_TEXTS.form.title).toBe('Título');
      expect(APP_TEXTS.form.titleRequired).toBe('Título *');
      expect(APP_TEXTS.form.description).toBe('Descripción');
    });

    it('should have placeholder translations', () => {
      expect(APP_TEXTS.placeholders.whatNeedsToBeDone).toBe('¿Qué necesitas hacer?');
      expect(APP_TEXTS.placeholders.selectCategory).toBe('Seleccionar Categoría');
    });

    it('should have empty state translations', () => {
      expect(APP_TEXTS.empty.noTodos).toBe('No hay tareas');
      expect(APP_TEXTS.empty.noCategories).toBe('No hay categorías');
    });

    it('should have alert translations', () => {
      expect(APP_TEXTS.alerts.noCategories).toBe('Sin Categorías');
      expect(APP_TEXTS.alerts.createCategoryFirst).toBeDefined();
    });

    it('should have form titles', () => {
      expect(APP_TEXTS.formTitles.newTodo).toBe('Nueva Tarea');
      expect(APP_TEXTS.formTitles.editTodo).toBe('Editar Tarea');
      expect(APP_TEXTS.formTitles.newCategory).toBe('Nueva Categoría');
      expect(APP_TEXTS.formTitles.editCategory).toBe('Editar Categoría');
    });

    it('should have typeahead translations', () => {
      expect(APP_TEXTS.typeahead.select).toBe('Seleccionar');
      expect(APP_TEXTS.typeahead.selectCategory).toBe('Seleccionar Categoría');
      expect(APP_TEXTS.typeahead.done).toBe('Listo');
    });
  });

  describe('APP_TEXTS_TOKEN', () => {
    it('should be defined', () => {
      expect(APP_TEXTS_TOKEN).toBeDefined();
    });
  });

  describe('AppTexts type', () => {
    it('should match APP_TEXTS structure', () => {
      const texts: AppTexts = APP_TEXTS;
      expect(texts.tabs.todos).toBe('Tareas');
    });
  });
});
