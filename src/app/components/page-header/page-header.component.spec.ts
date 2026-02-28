import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { PageHeaderComponent } from './page-header.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), PageHeaderComponent, ButtonIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('ion-title');
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should emit addElement when add button is clicked', () => {
    const emitSpy = jest.spyOn(component.addElement, 'emit');

    const buttonIcon = fixture.debugElement.query(By.directive(ButtonIconComponent));
    buttonIcon.componentInstance.iconClick.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should have translucent property set to true by default', () => {
    expect(component.translucent()).toBe(true);
  });

  it('should allow setting translucent to false', () => {
    fixture.componentRef.setInput('translucent', false);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('ion-header');
    expect(header.getAttribute('translucent')).toBeNull();
  });
});
