import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOfferLetterComponent } from './personal-offer-letter.component';

describe('PersonalOfferLetterComponent', () => {
  let component: PersonalOfferLetterComponent;
  let fixture: ComponentFixture<PersonalOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
