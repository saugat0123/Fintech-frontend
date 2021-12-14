import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankGuaranteeComponent } from './bank-guarantee.component';

describe('BankGuaranteeComponent', () => {
  let component: BankGuaranteeComponent;
  let fixture: ComponentFixture<BankGuaranteeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankGuaranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
