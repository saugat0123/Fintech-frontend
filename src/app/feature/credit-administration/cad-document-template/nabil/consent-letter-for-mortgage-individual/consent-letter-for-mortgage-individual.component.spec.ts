import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentLetterForMortgageIndividualComponent } from './consent-letter-for-mortgage-individual.component';

describe('ConsentLetterForMortgageIndividualComponent', () => {
  let component: ConsentLetterForMortgageIndividualComponent;
  let fixture: ComponentFixture<ConsentLetterForMortgageIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterForMortgageIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterForMortgageIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
