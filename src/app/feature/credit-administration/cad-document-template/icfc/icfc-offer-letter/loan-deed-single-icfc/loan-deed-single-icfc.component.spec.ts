import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedSingleIcfcComponent } from './loan-deed-single-icfc.component';

describe('LoanDeedSingleIcfcComponent', () => {
  let component: LoanDeedSingleIcfcComponent;
  let fixture: ComponentFixture<LoanDeedSingleIcfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedSingleIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedSingleIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
