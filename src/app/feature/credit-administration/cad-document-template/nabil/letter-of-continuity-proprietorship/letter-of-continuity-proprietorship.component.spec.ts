import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityProprietorshipComponent } from './letter-of-continuity-proprietorship.component';

describe('LetterOfContinuityProprietorshipComponent', () => {
  let component: LetterOfContinuityProprietorshipComponent;
  let fixture: ComponentFixture<LetterOfContinuityProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
