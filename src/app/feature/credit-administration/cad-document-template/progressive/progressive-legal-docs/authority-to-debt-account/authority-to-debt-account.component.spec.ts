import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityToDebtAccountComponent } from './authority-to-debt-account.component';

describe('AuthorityToDebtAccountComponent', () => {
  let component: AuthorityToDebtAccountComponent;
  let fixture: ComponentFixture<AuthorityToDebtAccountComponent>;

  beforeEach(async(() => {
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
