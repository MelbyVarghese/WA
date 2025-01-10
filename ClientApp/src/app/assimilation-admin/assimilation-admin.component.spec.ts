import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssimilationAdminComponent } from './assimilation-admin.component';

describe('AssimilationAdminComponent', () => {
  let component: AssimilationAdminComponent;
  let fixture: ComponentFixture<AssimilationAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssimilationAdminComponent]
    });
    fixture = TestBed.createComponent(AssimilationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
