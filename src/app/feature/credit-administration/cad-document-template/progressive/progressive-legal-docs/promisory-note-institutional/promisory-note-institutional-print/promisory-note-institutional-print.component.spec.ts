import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromisoryNoteInstitutionalPrintComponent } from './promisory-note-institutional-print.component';

describe('PromisoryNoteInstitutionalPrintComponent', () => {
  let component: PromisoryNoteInstitutionalPrintComponent;
  let fixture: ComponentFixture<PromisoryNoteInstitutionalPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromisoryNoteInstitutionalPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromisoryNoteInstitutionalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
