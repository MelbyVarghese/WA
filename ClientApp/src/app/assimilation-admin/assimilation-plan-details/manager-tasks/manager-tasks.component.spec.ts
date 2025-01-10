import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTasksComponent } from './manager-tasks.component';

describe('ManagerTasksComponent', () => {
  let component: ManagerTasksComponent;
  let fixture: ComponentFixture<ManagerTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTasksComponent]
    });
    fixture = TestBed.createComponent(ManagerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
