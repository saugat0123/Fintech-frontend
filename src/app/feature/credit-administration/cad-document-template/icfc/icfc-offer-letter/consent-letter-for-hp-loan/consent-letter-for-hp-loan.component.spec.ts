import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentLetterForHpLoanComponent } from './consent-letter-for-hp-loan.component';

describe('ConsentLetterForHpLoanComponent', () => {
  let component: ConsentLetterForHpLoanComponent;
  let fixture: ComponentFixture<ConsentLetterForHpLoanComponent>;

  beforeEach(async(() => {
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
