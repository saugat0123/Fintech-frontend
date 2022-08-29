import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLetterOfHypothecationPartnershipComponent } from './general-letter-of-hypothecation-partnership.component';

describe('GeneralLetterOfHypothecationPartnershipComponent', () => {
  let component: GeneralLetterOfHypothecationPartnershipComponent;
  let fixture: ComponentFixture<GeneralLetterOfHypothecationPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLetterOfHypothecationPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLetterOfHypothecationPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
