import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LetterOfAgreementPrintComponent} from './letter-of-agreement-print.component';

describe('LetterOfAgreementPrintComponent', () => {
  let component: LetterOfAgreementPrintComponent;
  let fixture: ComponentFixture<LetterOfAgreementPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfAgreementPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfAgreementPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
