import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateAssimilationComponent } from './associate-assimilation.component';

describe('AssociateAssimilationComponent', () => {
  let component: AssociateAssimilationComponent;
  let fixture: ComponentFixture<AssociateAssimilationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssociateAssimilationComponent]
    });
    fixture = TestBed.createComponent(AssociateAssimilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
