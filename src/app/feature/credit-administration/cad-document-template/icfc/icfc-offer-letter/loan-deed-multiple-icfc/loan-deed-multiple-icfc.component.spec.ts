import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedMultipleIcfcComponent } from './loan-deed-multiple-icfc.component';

describe('LoanDeedMultipleIcfcComponent', () => {
  let component: LoanDeedMultipleIcfcComponent;
  let fixture: ComponentFixture<LoanDeedMultipleIcfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedMultipleIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedMultipleIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
