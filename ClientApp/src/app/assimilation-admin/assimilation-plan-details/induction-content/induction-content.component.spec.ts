import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InductionContentComponent } from './induction-content.component';

describe('InductionContentComponent', () => {
  let component: InductionContentComponent;
  let fixture: ComponentFixture<InductionContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InductionContentComponent]
    });
    fixture = TestBed.createComponent(InductionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
