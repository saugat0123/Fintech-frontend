import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSubsidySanctionLetterComponent } from './interest-subsidy-sanction-letter.component';

describe('InterestSubsidySanctionLetterComponent', () => {
  let component: InterestSubsidySanctionLetterComponent;
  let fixture: ComponentFixture<InterestSubsidySanctionLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestSubsidySanctionLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestSubsidySanctionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
