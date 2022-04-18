import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevolvingShortTermLoanComponent } from './revolving-short-term-loan.component';

describe('RevolvingShortTermLoanComponent', () => {
  let component: RevolvingShortTermLoanComponent;
  let fixture: ComponentFixture<RevolvingShortTermLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevolvingShortTermLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevolvingShortTermLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
