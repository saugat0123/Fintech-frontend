import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PromissoryNoteGuarantorPrintComponent} from './promissory-note-guarantor-print.component';

describe('PromissoryNoteGuarantorPrintComponent', () => {
  let component: PromissoryNoteGuarantorPrintComponent;
  let fixture: ComponentFixture<PromissoryNoteGuarantorPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PromissoryNoteGuarantorPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteGuarantorPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
