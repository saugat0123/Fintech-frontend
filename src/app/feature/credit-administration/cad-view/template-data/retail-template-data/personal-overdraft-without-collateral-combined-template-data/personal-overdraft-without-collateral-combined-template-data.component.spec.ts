import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent } from './personal-overdraft-without-collateral-combined-template-data.component';

describe('PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent', () => {
  let component: PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent;
  let fixture: ComponentFixture<PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
