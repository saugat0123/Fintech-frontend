import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGuaranteeSamplePrintComponent } from './bank-guarantee-sample-print.component';

describe('BankGuaranteeSamplePrintComponent', () => {
  let component: BankGuaranteeSamplePrintComponent;
  let fixture: ComponentFixture<BankGuaranteeSamplePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankGuaranteeSamplePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGuaranteeSamplePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
