import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncomeFromAccountViewComponent } from './income-from-account-view.component';

describe('IncomeFromAccountViewComponent', () => {
  let component: IncomeFromAccountViewComponent;
  let fixture: ComponentFixture<IncomeFromAccountViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeFromAccountViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeFromAccountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
