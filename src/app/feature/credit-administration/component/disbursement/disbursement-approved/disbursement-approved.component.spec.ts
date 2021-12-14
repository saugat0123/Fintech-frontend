import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisbursementApprovedComponent } from './disbursement-approved.component';

describe('DisbursementApprovedComponent', () => {
  let component: DisbursementApprovedComponent;
  let fixture: ComponentFixture<DisbursementApprovedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
