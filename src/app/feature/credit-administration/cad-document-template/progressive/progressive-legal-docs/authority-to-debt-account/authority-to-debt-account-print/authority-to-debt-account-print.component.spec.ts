import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityToDebtAccountPrintComponent } from './authority-to-debt-account-print.component';

describe('AuthorityToDebtAccountPrintComponent', () => {
  let component: AuthorityToDebtAccountPrintComponent;
  let fixture: ComponentFixture<AuthorityToDebtAccountPrintComponent>;

  beforeEach(async(() => {
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
