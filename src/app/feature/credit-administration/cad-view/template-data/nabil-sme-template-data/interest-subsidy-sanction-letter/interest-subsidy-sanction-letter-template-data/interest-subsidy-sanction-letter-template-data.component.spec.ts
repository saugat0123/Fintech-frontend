import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSubsidySanctionLetterTemplateDataComponent } from './interest-subsidy-sanction-letter-template-data.component';

describe('InterestSubsidySanctionLetterTemplateDataComponent', () => {
  let component: InterestSubsidySanctionLetterTemplateDataComponent;
  let fixture: ComponentFixture<InterestSubsidySanctionLetterTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestSubsidySanctionLetterTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestSubsidySanctionLetterTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
