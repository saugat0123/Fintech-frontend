import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStrategyComponent } from './account-strategy.component';

describe('AccountStrategyComponent', () => {
  let component: AccountStrategyComponent;
  let fixture: ComponentFixture<AccountStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
