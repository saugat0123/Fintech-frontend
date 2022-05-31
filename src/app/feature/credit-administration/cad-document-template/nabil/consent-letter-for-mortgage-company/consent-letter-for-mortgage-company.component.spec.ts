import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentLetterForMortgageCompanyComponent } from './consent-letter-for-mortgage-company.component';

describe('ConsentLetterForMortgageCompanyComponent', () => {
  let component: ConsentLetterForMortgageCompanyComponent;
  let fixture: ComponentFixture<ConsentLetterForMortgageCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterForMortgageCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterForMortgageCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
