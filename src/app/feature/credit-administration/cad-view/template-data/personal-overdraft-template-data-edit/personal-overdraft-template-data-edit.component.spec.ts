import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftTemplateDataEditComponent } from './personal-overdraft-template-data-edit.component';

describe('PersonalOverdraftTemplateDataEditComponent', () => {
  let component: PersonalOverdraftTemplateDataEditComponent;
  let fixture: ComponentFixture<PersonalOverdraftTemplateDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftTemplateDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftTemplateDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
