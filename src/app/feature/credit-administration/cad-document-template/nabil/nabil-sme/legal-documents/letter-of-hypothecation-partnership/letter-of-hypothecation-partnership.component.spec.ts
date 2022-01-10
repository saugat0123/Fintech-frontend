import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfHypothecationPartnershipComponent } from './letter-of-hypothecation-partnership.component';

describe('LetterOfHypothecationPartnershipComponent', () => {
  let component: LetterOfHypothecationPartnershipComponent;
  let fixture: ComponentFixture<LetterOfHypothecationPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfHypothecationPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfHypothecationPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
