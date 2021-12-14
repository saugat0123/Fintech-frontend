import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerificationActionModelComponent } from './verification-action-model.component';

describe('VerificationActionModelComponent', () => {
  let component: VerificationActionModelComponent;
  let fixture: ComponentFixture<VerificationActionModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationActionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationActionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
