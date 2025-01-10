import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagerTaskComponent } from './add-manager-task.component';

describe('AddManagerTaskComponent', () => {
  let component: AddManagerTaskComponent;
  let fixture: ComponentFixture<AddManagerTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddManagerTaskComponent]
    });
    fixture = TestBed.createComponent(AddManagerTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
