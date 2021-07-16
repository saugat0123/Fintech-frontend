import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteIcfcPrintComponent } from './promissory-note-icfc-print.component';

describe('PromissoryNoteIcfcPrintComponent', () => {
  let component: PromissoryNoteIcfcPrintComponent;
  let fixture: ComponentFixture<PromissoryNoteIcfcPrintComponent>;

  beforeEach(async(() => {
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
