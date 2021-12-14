import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PromissoryNoteGuarantorPrintComponent} from './promissory-note-guarantor-print.component';

describe('PromissoryNoteGuarantorPrintComponent', () => {
  let component: PromissoryNoteGuarantorPrintComponent;
  let fixture: ComponentFixture<PromissoryNoteGuarantorPrintComponent>;

  beforeEach(waitForAsync(() => {
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
