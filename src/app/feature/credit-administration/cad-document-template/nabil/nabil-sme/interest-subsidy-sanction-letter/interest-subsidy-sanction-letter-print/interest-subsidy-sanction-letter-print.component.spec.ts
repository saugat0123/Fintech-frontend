import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSubsidySanctionLetterPrintComponent } from './interest-subsidy-sanction-letter-print.component';

describe('InterestSubsidySanctionLetterPrintComponent', () => {
  let component: InterestSubsidySanctionLetterPrintComponent;
  let fixture: ComponentFixture<InterestSubsidySanctionLetterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestSubsidySanctionLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestSubsidySanctionLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
