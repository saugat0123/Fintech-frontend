import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedHirePurchaseComponent } from './loan-deed-hire-purchase.component';

describe('LoanDeedHirePurchaseComponent', () => {
  let component: LoanDeedHirePurchaseComponent;
  let fixture: ComponentFixture<LoanDeedHirePurchaseComponent>;

  beforeEach(async(() => {
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
