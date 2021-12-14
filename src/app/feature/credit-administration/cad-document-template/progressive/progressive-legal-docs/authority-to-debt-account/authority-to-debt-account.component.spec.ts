import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthorityToDebtAccountComponent } from './authority-to-debt-account.component';

describe('AuthorityToDebtAccountComponent', () => {
  let component: AuthorityToDebtAccountComponent;
  let fixture: ComponentFixture<AuthorityToDebtAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityToDebtAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityToDebtAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
