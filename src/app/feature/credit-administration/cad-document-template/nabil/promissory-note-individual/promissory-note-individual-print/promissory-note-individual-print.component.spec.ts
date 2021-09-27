import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteIndividualPrintComponent } from './promissory-note-individual-print.component';

describe('PromissoryNoteIndividualPrintComponent', () => {
  let component: PromissoryNoteIndividualPrintComponent;
  let fixture: ComponentFixture<PromissoryNoteIndividualPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteIndividualPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteIndividualPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
