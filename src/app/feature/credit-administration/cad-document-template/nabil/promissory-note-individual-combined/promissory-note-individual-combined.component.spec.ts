import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteIndividualCombinedComponent } from './promissory-note-individual-combined.component';

describe('PromissoryNoteIndividualCombinedComponent', () => {
  let component: PromissoryNoteIndividualCombinedComponent;
  let fixture: ComponentFixture<PromissoryNoteIndividualCombinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteIndividualCombinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteIndividualCombinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
