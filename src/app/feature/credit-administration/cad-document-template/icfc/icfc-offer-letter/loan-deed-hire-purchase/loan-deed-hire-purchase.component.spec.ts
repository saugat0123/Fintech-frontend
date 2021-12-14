import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanDeedHirePurchaseComponent } from './loan-deed-hire-purchase.component';

describe('LoanDeedHirePurchaseComponent', () => {
  let component: LoanDeedHirePurchaseComponent;
  let fixture: ComponentFixture<LoanDeedHirePurchaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedHirePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedHirePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
