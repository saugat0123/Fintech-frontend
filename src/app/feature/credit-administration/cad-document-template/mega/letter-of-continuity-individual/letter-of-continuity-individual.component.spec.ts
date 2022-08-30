import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityIndividualComponent } from './letter-of-continuity-individual.component';

describe('LetterOfContinuityIndividualComponent', () => {
  let component: LetterOfContinuityIndividualComponent;
  let fixture: ComponentFixture<LetterOfContinuityIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
