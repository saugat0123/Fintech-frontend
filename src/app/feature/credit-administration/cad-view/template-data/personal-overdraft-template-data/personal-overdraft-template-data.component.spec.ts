import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftTemplateDataComponent } from './personal-overdraft-template-data.component';

describe('PersonalOverdraftTemplateDataComponent', () => {
  let component: PersonalOverdraftTemplateDataComponent;
  let fixture: ComponentFixture<PersonalOverdraftTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
