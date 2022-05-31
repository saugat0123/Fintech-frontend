import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentLetterForMortgageProprietorshipComponent } from './consent-letter-for-mortgage-proprietorship.component';

describe('ConsentLetterForMortgageProprietorshipComponent', () => {
  let component: ConsentLetterForMortgageProprietorshipComponent;
  let fixture: ComponentFixture<ConsentLetterForMortgageProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterForMortgageProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterForMortgageProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
