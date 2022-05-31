import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftWithoutCollateralTemplateEditComponent } from './personal-overdraft-without-collateral-template-edit.component';

describe('PersonalOverdraftWithoutCollateralTemplateEditComponent', () => {
  let component: PersonalOverdraftWithoutCollateralTemplateEditComponent;
  let fixture: ComponentFixture<PersonalOverdraftWithoutCollateralTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftWithoutCollateralTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftWithoutCollateralTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
