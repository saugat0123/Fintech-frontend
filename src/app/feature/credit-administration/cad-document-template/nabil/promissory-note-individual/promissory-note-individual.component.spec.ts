import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteIndividualComponent } from './promissory-note-individual.component';

describe('PromissoryNoteIndividualComponent', () => {
  let component: PromissoryNoteIndividualComponent;
  let fixture: ComponentFixture<PromissoryNoteIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
