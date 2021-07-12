import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GammaIncomeFromAccountSummaryComponent } from './gamma-income-from-account-summary.component';

describe('GammaIncomeFromAccountSummaryComponent', () => {
  let component: GammaIncomeFromAccountSummaryComponent;
  let fixture: ComponentFixture<GammaIncomeFromAccountSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GammaIncomeFromAccountSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GammaIncomeFromAccountSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
