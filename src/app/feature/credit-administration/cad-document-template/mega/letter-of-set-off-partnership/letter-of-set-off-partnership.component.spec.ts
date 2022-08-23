import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfSetOffPartnershipComponent } from './letter-of-set-off-partnership.component';

describe('LetterOfSetOffPartnershipComponent', () => {
  let component: LetterOfSetOffPartnershipComponent;
  let fixture: ComponentFixture<LetterOfSetOffPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfSetOffPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfSetOffPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
