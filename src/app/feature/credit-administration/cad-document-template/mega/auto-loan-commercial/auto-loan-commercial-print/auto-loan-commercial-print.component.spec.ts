import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanCommercialPrintComponent } from './auto-loan-commercial-print.component';

describe('AutoLoanCommercialPrintComponent', () => {
  let component: AutoLoanCommercialPrintComponent;
  let fixture: ComponentFixture<AutoLoanCommercialPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanCommercialPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanCommercialPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
