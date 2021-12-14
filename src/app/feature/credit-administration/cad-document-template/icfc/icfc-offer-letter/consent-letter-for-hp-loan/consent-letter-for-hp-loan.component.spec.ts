import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsentLetterForHpLoanComponent } from './consent-letter-for-hp-loan.component';

describe('ConsentLetterForHpLoanComponent', () => {
  let component: ConsentLetterForHpLoanComponent;
  let fixture: ComponentFixture<ConsentLetterForHpLoanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterForHpLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterForHpLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
