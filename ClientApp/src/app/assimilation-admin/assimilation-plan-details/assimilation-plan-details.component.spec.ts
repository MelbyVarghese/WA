import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssimilationPlanDetailsComponent } from './assimilation-plan-details.component';

describe('AssimilationPlanDetailsComponent', () => {
  let component: AssimilationPlanDetailsComponent;
  let fixture: ComponentFixture<AssimilationPlanDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssimilationPlanDetailsComponent]
    });
    fixture = TestBed.createComponent(AssimilationPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
