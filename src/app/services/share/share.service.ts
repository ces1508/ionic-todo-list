import { Injectable, inject } from '@angular/core';
import { Todo } from '@models/todo.model';
import { Share } from '@capacitor/share';
import { convertTodosToCSV } from '@utils/todo-csv.util';
import { APP_TEXTS_TOKEN } from '@core/app-texts';
import { AppTexts } from '@core/app-texts';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly texts = inject<AppTexts>(APP_TEXTS_TOKEN);

  /**
   * Shares todos as a CSV file using Web Share API
   * Falls back to download if Web Share is not supported
   */
  async shareAsCSV(todos: Todo[], filename = 'todos.csv'): Promise<void> {
    if (todos.length === 0) {
      console.warn('No todos to share');
      return;
    }

    const csv = convertTodosToCSV(todos);
    const canShare = await Share.canShare()
    // Check if Web Share API is supported with files
    if (canShare.value) {
      try {
        await Share.share({
          title: this.texts.share.exportTodos,
          text: csv,
        });
        return;
      } catch (error) {
        // User cancelled or share failed - not an error
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
        return;
      }
    }
  }

}
