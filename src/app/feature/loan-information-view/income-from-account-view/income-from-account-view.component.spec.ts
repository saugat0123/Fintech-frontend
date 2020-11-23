import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeFromAccountViewComponent } from './income-from-account-view.component';

describe('IncomeFromAccountViewComponent', () => {
  let component: IncomeFromAccountViewComponent;
  let fixture: ComponentFixture<IncomeFromAccountViewComponent>;

  beforeEach(async(() => {
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
