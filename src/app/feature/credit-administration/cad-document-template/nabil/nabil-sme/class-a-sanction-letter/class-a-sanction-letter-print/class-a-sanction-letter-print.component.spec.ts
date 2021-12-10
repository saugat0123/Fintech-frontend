import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassASanctionLetterPrintComponent } from './class-a-sanction-letter-print.component';

describe('ClassASanctionLetterPrintComponent', () => {
  let component: ClassASanctionLetterPrintComponent;
  let fixture: ComponentFixture<ClassASanctionLetterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassASanctionLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassASanctionLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
