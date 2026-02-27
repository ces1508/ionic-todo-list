# AGENTS.md - Ionic Todo List Project

## Overview
This is an Ionic + Angular application with SQLite for local storage and Jest for unit testing.

## Build, Lint & Test Commands

### Development Server
```bash
npm start                    # Start Ionic dev server (ionic serve)
npm run watch              # Watch mode for development
```

### Build
```bash
npm run build             # Production build (ng build)
```

### Testing (Jest - Primary)
```bash
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

#### Running a Single Test
```bash
# Run specific test file
jest src/app/home/home.page.spec.ts

# Run tests matching a pattern
jest --testNamePattern="should create"

# Run tests in a specific folder
jest src/app/services/

# Run tests with verbose output
jest --verbose

# Run tests and update snapshots
jest --updateSnapshot
```

### Linting
```bash
npm run lint              # Run ESLint (ng lint)
```

### TypeScript
```bash
npx tsc --noEmit          # Type check without emitting
npx ng build              # Also performs type checking
```

---

## Code Style Guidelines

### General Rules
- Use **strict mode** in TypeScript (enabled in tsconfig.json)
- All new code must pass linting: `npm run lint`
- Build must succeed before committing: `npm run build`

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase with suffix | `HomePage`, `TodoListComponent` |
| Services | PascalCase with suffix | `TodoService`, `AuthService` |
| Directives | PascalCase with suffix | `HighlightDirective` |
| Pipes | PascalCase with suffix | `DateFormatPipe` |
| Variables | camelCase | `todoList`, `isComplete` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS`, `API_URL` |
| File names | kebab-case | `home.page.ts`, `todo.service.ts` |
| HTML selectors | kebab-case | `<app-home>`, `<ion-button>` |

### Imports

```typescript
// Angular core imports first
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Ionic imports
import { IonContent, IonButton } from '@ionic/angular/';

// Third-party imports
import { BehaviorSubject, Observable } from 'rxjs';

// Local imports (use relative paths)
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
```

### TypeScript Guidelines

- **Always use explicit types** for function parameters and return types
- **Use interfaces** for object shapes (not types when possible)
- **Avoid `any`** - use `unknown` if type is truly unknown
- **Enable strict null checks** - check for null/undefined explicitly

```typescript
// Good
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

class TodoService {
  getAll(): Promise<Todo[]> { ... }
  add(todo: Omit<Todo, 'id'>): Promise<Todo> { ... }
}

// Avoid
function process(data: any): any { ... }
```

### Component Structure

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filter: 'all' | 'active' | 'completed' = 'all';

  constructor(
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    // Initialize data
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
  }
}
```

### Error Handling

- Use try-catch for async operations
- Always handle errors in services
- Display user-friendly error messages in UI

```typescript
async addTodo(title: string): Promise<void> {
  try {
    await this.todoService.add({ title, completed: false });
  } catch (error) {
    console.error('Failed to add todo:', error);
    // Show error toast to user
  }
}
```

### Testing Guidelines (Jest)

- Test files must end with `.spec.ts`
- Use `jest-preset-angular` for Angular testing
- Follow AAA pattern: **Arrange, Act, Assert**

```typescript
describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Ionic-Specific Guidelines

- Use Ionic components: `<ion-button>`, `<ion-input>`, `<ion-list>`, etc.
- Follow Ionic patterns for pages (standalone: false for now)
- Use Ionic lifecycle: `ionViewWillEnter`, `ionViewDidLeave`
- Handle platform-specific code with `Platform` service

### SQLite Guidelines

- Use `@capacitor-community/sqlite` for native SQLite
- Initialize database in app bootstrap
- Use transactions for batch operations
- Handle database errors gracefully

```typescript
async initDatabase(): Promise<void> {
  const db = await SQLite.createDatabase({
    name: 'todo.db',
    location: 'default'
  });

  await db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      createdAt TEXT
    )
  `);
}
```

---

## Project Structure

```
src/
├── app/
│   ├── home/
│   │   ├── home.page.ts       # Main todo list page
│   │   ├── home.page.html    # Template
│   │   ├── home.page.scss    # Styles
│   │   └── home.page.spec.ts # Tests
│   ├── services/              # Business logic
│   ├── models/                # Interfaces/types
│   └── shared/                # Shared components/pipes
├── environments/              # Environment configs
└── assets/                    # Static assets
```

---

## Common Tasks

### Add a New Service
1. Create file in `src/app/services/`
2. Add to providers in `app.module.ts`
3. Write unit tests in `*.service.spec.ts`

### Add a New Page
1. Use: `ionic g page pages/page-name`
2. Add route in `home-routing.module.ts`
3. Write unit tests

### Run Against Specific Node Version
```bash
# Project requires Node 22.12+
nvm use 22.12
npm install
npm run build
```

---

## Dependencies Note

This project uses:
- Ionic Framework 8.x
- Angular 20.x
- Capacitor 8.x
- Jest 30.x (not Karma)
- TypeScript 5.9.x
- Node.js 22.12+ (required)
