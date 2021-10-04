import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromisoryNoteIndividualComponent } from './promisory-note-individual.component';

describe('PromisoryNoteIndividualComponent', () => {
  let component: PromisoryNoteIndividualComponent;
  let fixture: ComponentFixture<PromisoryNoteIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromisoryNoteIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromisoryNoteIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
