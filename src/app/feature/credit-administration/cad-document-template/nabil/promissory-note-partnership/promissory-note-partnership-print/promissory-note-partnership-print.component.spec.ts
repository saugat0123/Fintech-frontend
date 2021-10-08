import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNotePartnershipPrintComponent } from './promissory-note-partnership-print.component';

describe('PromissoryNotePartnershipPrintComponent', () => {
  let component: PromissoryNotePartnershipPrintComponent;
  let fixture: ComponentFixture<PromissoryNotePartnershipPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNotePartnershipPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNotePartnershipPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
