import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LetterOfAgreementIcfcComponent } from './letter-of-agreement-icfc.component';

describe('LetterOfAgreementIcfcComponent', () => {
  let component: LetterOfAgreementIcfcComponent;
  let fixture: ComponentFixture<LetterOfAgreementIcfcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfAgreementIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfAgreementIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
