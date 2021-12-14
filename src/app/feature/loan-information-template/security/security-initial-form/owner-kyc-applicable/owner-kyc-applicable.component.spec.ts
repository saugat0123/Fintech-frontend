import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnerKycApplicableComponent } from './owner-kyc-applicable.component';

describe('OwnerKycApplicableComponent', () => {
  let component: OwnerKycApplicableComponent;
  let fixture: ComponentFixture<OwnerKycApplicableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerKycApplicableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerKycApplicableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
