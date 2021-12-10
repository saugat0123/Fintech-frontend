import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassASanctionLetterTemplateDataComponent } from './class-a-sanction-letter-template-data.component';

describe('ClassASanctionLetterTemplateDataComponent', () => {
  let component: ClassASanctionLetterTemplateDataComponent;
  let fixture: ComponentFixture<ClassASanctionLetterTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassASanctionLetterTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassASanctionLetterTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
