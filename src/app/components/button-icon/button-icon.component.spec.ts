import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ButtonIconComponent } from './button-icon.component';

describe('ButtonIconComponent', () => {
  let component: ButtonIconComponent;
  let fixture: ComponentFixture<ButtonIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ButtonIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonIconComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('iconName', 'add');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have iconName as required input', () => {
    expect(component.iconName).toBeDefined();
  });

  it('should have disabled input default to false', () => {
    expect(component.disabled()).toBe(false);
  });

  it('should have iconSlot default to icon-only', () => {
    expect(component.iconSlot()).toBe('icon-only');
  });

  it('should have fill input that defaults to clear', () => {
    expect(component.fill()).toBe('clear');
  });

  it('should emit iconClick when button is clicked', () => {
    const emitSpy = jest.spyOn(component.iconClick, 'emit');

    const ionButton = fixture.nativeElement.querySelector('ion-button');
    ionButton.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should set disabled property on button', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const ionButton = fixture.nativeElement.querySelector('ion-button') as HTMLIonButtonElement;
    expect(ionButton.disabled).toBe(true);
  });

  it('should display icon with correct name', () => {
    const ionIcon = fixture.nativeElement.querySelector('ion-icon');
    expect(ionIcon.getAttribute('name')).toBe('add');
  });

  it('should allow setting iconSlot to start', () => {
    fixture.componentRef.setInput('iconSlot', 'start');
    fixture.detectChanges();

    const ionIcon = fixture.nativeElement.querySelector('ion-icon');
    expect(ionIcon.getAttribute('slot')).toBe('start');
  });
});
