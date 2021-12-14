import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LetterOfAgreementComponent} from './letter-of-agreement.component';

describe('LetterOfAgreementComponent', () => {
  let component: LetterOfAgreementComponent;
  let fixture: ComponentFixture<LetterOfAgreementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfAgreementComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
