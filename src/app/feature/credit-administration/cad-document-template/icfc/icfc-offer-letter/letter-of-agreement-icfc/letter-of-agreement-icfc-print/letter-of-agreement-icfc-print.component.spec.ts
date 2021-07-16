import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfAgreementIcfcPrintComponent } from './letter-of-agreement-icfc-print.component';

describe('LetterOfAgreementIcfcPrintComponent', () => {
  let component: LetterOfAgreementIcfcPrintComponent;
  let fixture: ComponentFixture<LetterOfAgreementIcfcPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfAgreementIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfAgreementIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
