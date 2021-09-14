import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityInstitutionalComponent } from './letter-of-continuity-institutional.component';

describe('LetterOfContinuityInstitutionalComponent', () => {
  let component: LetterOfContinuityInstitutionalComponent;
  let fixture: ComponentFixture<LetterOfContinuityInstitutionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityInstitutionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityInstitutionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
