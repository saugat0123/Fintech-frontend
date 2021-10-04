import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromisoryNoteIndividualPrintComponent } from './promisory-note-individual-print.component';

describe('PromisoryNoteIndividualPrintComponent', () => {
  let component: PromisoryNoteIndividualPrintComponent;
  let fixture: ComponentFixture<PromisoryNoteIndividualPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromisoryNoteIndividualPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromisoryNoteIndividualPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
