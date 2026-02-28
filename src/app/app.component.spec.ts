import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { AppComponent } from './app.component';
import { RemoteConfigService } from './services/remote-config/remote-config.service';
import { CategoryService } from './services/category/category.service';

describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: RemoteConfigService,
          useValue: {
            getBoolean: jest.fn().mockResolvedValue(true),
            isReady: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            loadCategories: jest.fn().mockResolvedValue(undefined),
            hasCategories: signal(false),
            categories: signal([]),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
