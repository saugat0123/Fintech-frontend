import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfAgreementSampleComponent } from './letter-of-agreement-sample.component';

describe('LetterOfAgreementSampleComponent', () => {
  let component: LetterOfAgreementSampleComponent;
  let fixture: ComponentFixture<LetterOfAgreementSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfAgreementSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfAgreementSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
