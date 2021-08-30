import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfCommitmentPrintComponent } from './letter-of-commitment-print.component';

describe('LetterOfCommitmentPrintComponent', () => {
  let component: LetterOfCommitmentPrintComponent;
  let fixture: ComponentFixture<LetterOfCommitmentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfCommitmentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfCommitmentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
