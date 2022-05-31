import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftCombinedTemplateDataComponent } from './personal-overdraft-combined-template-data.component';

describe('PersonalOverdraftCombinedTemplateDataComponent', () => {
  let component: PersonalOverdraftCombinedTemplateDataComponent;
  let fixture: ComponentFixture<PersonalOverdraftCombinedTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftCombinedTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftCombinedTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
