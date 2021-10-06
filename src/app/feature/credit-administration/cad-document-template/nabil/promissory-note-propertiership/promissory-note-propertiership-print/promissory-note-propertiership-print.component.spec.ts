import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNotePropertiershipPrintComponent } from './promissory-note-propertiership-print.component';

describe('PromissoryNotePropertiershipPrintComponent', () => {
  let component: PromissoryNotePropertiershipPrintComponent;
  let fixture: ComponentFixture<PromissoryNotePropertiershipPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNotePropertiershipPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNotePropertiershipPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
