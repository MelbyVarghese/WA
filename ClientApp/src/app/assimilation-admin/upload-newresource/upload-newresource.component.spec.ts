import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewresourceComponent } from './upload-newresource.component';

describe('UploadNewresourceComponent', () => {
  let component: UploadNewresourceComponent;
  let fixture: ComponentFixture<UploadNewresourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadNewresourceComponent]
    });
    fixture = TestBed.createComponent(UploadNewresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
