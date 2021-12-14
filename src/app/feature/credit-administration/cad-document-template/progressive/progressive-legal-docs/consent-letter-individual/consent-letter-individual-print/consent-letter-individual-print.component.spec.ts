import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsentLetterIndividualPrintComponent } from './consent-letter-individual-print.component';

describe('ConsentLetterIndividualPrintComponent', () => {
  let component: ConsentLetterIndividualPrintComponent;
  let fixture: ComponentFixture<ConsentLetterIndividualPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterIndividualPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterIndividualPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
