import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteIcfcComponent } from './promissory-note-icfc.component';

describe('PromissoryNoteIcfcComponent', () => {
  let component: PromissoryNoteIcfcComponent;
  let fixture: ComponentFixture<PromissoryNoteIcfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
