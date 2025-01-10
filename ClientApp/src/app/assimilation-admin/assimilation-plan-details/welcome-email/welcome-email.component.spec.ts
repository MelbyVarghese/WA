import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeEmailComponent } from './welcome-email.component';

describe('WelcomeEmailComponent', () => {
  let component: WelcomeEmailComponent;
  let fixture: ComponentFixture<WelcomeEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeEmailComponent]
    });
    fixture = TestBed.createComponent(WelcomeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
