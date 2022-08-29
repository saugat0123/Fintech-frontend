import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteProprietorshipComponent } from './promissory-note-proprietorship.component';

describe('PromissoryNoteProprietorshipComponent', () => {
  let component: PromissoryNoteProprietorshipComponent;
  let fixture: ComponentFixture<PromissoryNoteProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
