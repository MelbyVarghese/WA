import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InductionSelfComponent } from './induction-self.component';

describe('InductionSelfComponent', () => {
  let component: InductionSelfComponent;
  let fixture: ComponentFixture<InductionSelfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InductionSelfComponent]
    });
    fixture = TestBed.createComponent(InductionSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
