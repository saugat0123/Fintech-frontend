import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncomeFromAccountSummeryComponent } from './income-from-account-summery.component';

describe('IncomeFromAccountSummeryComponent', () => {
  let component: IncomeFromAccountSummeryComponent;
  let fixture: ComponentFixture<IncomeFromAccountSummeryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeFromAccountSummeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeFromAccountSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
