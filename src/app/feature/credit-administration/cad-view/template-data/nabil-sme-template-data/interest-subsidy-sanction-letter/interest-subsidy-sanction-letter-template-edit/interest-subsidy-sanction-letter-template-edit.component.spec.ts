import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSubsidySanctionLetterTemplateEditComponent } from './interest-subsidy-sanction-letter-template-edit.component';

describe('InterestSubsidySanctionLetterTemplateEditComponent', () => {
  let component: InterestSubsidySanctionLetterTemplateEditComponent;
  let fixture: ComponentFixture<InterestSubsidySanctionLetterTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestSubsidySanctionLetterTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestSubsidySanctionLetterTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
