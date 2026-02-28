import { TestBed } from '@angular/core/testing';
import { ShareService } from './share.service';
import { Todo } from '@models/todo.model';
import { Share } from '@capacitor/share';

jest.mock('@capacitor/share', () => ({
  Share: {
    canShare: jest.fn().mockReturnValue(Promise.resolve({ value: true })),
    share: jest.fn().mockReturnValue(Promise.resolve()),
  },
}));

describe('ShareService', () => {
  let service: ShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareService],
    });

    service = TestBed.inject(ShareService);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('shareAsCSV', () => {
    const mockTodos: Todo[] = [
      {
        id: 1,
        title: 'Test Todo',
        completed: false,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        title: 'Completed Todo',
        completed: true,
        createdAt: new Date('2024-01-02'),
      },
    ];

    it('should warn and return if no todos to share', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      await service.shareAsCSV([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith('No todos to share');
      consoleWarnSpy.mockRestore();
    });

    it('should not call Share API if canShare returns false', async () => {
      (Share.canShare as jest.Mock).mockResolvedValue({ value: false });
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await service.shareAsCSV(mockTodos);
      
      expect(Share.canShare).toHaveBeenCalled();
      expect(Share.share).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should call Share.share when canShare returns true', async () => {
      (Share.canShare as jest.Mock).mockResolvedValue({ value: true });
      (Share.share as jest.Mock).mockResolvedValue(undefined);

      await service.shareAsCSV(mockTodos);

      expect(Share.share).toHaveBeenCalled();
      const callArgs = (Share.share as jest.Mock).mock.calls[0][0];
      expect(callArgs.title).toBe('Exportar Tareas');
    });

    it('should handle user cancellation gracefully', async () => {
      (Share.canShare as jest.Mock).mockResolvedValue({ value: true });
      const error = new Error('User cancelled');
      error.name = 'AbortError';
      (Share.share as jest.Mock).mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.shareAsCSV(mockTodos);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should log errors that are not abort errors', async () => {
      (Share.canShare as jest.Mock).mockResolvedValue({ value: true });
      (Share.share as jest.Mock).mockRejectedValue(new Error('Share failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.shareAsCSV(mockTodos);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
