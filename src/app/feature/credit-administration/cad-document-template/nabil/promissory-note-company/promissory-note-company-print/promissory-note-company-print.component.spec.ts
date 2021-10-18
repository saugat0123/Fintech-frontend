import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteCompanyPrintComponent } from './promissory-note-company-print.component';

describe('PromissoryNoteCompanyPrintComponent', () => {
  let component: PromissoryNoteCompanyPrintComponent;
  let fixture: ComponentFixture<PromissoryNoteCompanyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteCompanyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteCompanyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
