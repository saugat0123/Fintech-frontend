import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpNoteGuarantorPrintComponent } from './dp-note-guarantor-print.component';

describe('DpNoteGuarantorPrintComponent', () => {
  let component: DpNoteGuarantorPrintComponent;
  let fixture: ComponentFixture<DpNoteGuarantorPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpNoteGuarantorPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpNoteGuarantorPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
