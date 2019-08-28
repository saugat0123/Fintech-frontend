import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditGradingComponent } from './credit-grading.component';

describe('CreditGradingComponent', () => {
  let component: CreditGradingComponent;
  let fixture: ComponentFixture<CreditGradingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditGradingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
