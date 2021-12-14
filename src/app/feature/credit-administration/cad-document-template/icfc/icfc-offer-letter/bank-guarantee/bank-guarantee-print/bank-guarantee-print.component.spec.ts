import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankGuaranteePrintComponent } from './bank-guarantee-print.component';

describe('BankGuaranteePrintComponent', () => {
  let component: BankGuaranteePrintComponent;
  let fixture: ComponentFixture<BankGuaranteePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankGuaranteePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGuaranteePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
