import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneTasksComponent } from './milestone-tasks.component';

describe('MilestoneTasksComponent', () => {
  let component: MilestoneTasksComponent;
  let fixture: ComponentFixture<MilestoneTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MilestoneTasksComponent]
    });
    fixture = TestBed.createComponent(MilestoneTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
