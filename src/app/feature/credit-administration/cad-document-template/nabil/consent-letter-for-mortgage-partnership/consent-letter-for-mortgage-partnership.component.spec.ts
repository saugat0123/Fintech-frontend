import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentLetterForMortgagePartnershipComponent } from './consent-letter-for-mortgage-partnership.component';

describe('ConsentLetterForMortgagePartnershipComponent', () => {
  let component: ConsentLetterForMortgagePartnershipComponent;
  let fixture: ComponentFixture<ConsentLetterForMortgagePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterForMortgagePartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterForMortgagePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
