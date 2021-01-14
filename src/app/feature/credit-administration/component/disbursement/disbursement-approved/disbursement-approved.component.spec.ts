import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementApprovedComponent } from './disbursement-approved.component';

describe('DisbursementApprovedComponent', () => {
  let component: DisbursementApprovedComponent;
  let fixture: ComponentFixture<DisbursementApprovedComponent>;

  beforeEach(async(() => {
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
