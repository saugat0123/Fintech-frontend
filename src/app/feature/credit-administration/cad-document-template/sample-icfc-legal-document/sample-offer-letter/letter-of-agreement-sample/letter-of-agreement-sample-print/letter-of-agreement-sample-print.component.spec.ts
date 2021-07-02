import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfAgreementSamplePrintComponent } from './letter-of-agreement-sample-print.component';

describe('LetterOfAgreementSamplePrintComponent', () => {
  let component: LetterOfAgreementSamplePrintComponent;
  let fixture: ComponentFixture<LetterOfAgreementSamplePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfAgreementSamplePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfAgreementSamplePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
