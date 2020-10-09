import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeFromAccountComponent } from './income-from-account.component';

describe('IncomeFromAccountComponent', () => {
  let component: IncomeFromAccountComponent;
  let fixture: ComponentFixture<IncomeFromAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeFromAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeFromAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
