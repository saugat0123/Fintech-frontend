import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthorityToDebtAccountPrintComponent } from './authority-to-debt-account-print.component';

describe('AuthorityToDebtAccountPrintComponent', () => {
  let component: AuthorityToDebtAccountPrintComponent;
  let fixture: ComponentFixture<AuthorityToDebtAccountPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityToDebtAccountPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityToDebtAccountPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
