import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromissoryNoteIcfcPrintComponent } from './promissory-note-icfc-print.component';

describe('PromissoryNoteIcfcPrintComponent', () => {
  let component: PromissoryNoteIcfcPrintComponent;
  let fixture: ComponentFixture<PromissoryNoteIcfcPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
