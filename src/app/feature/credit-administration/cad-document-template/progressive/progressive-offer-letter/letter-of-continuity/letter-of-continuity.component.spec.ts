import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityComponent } from './letter-of-continuity.component';

describe('LetterOfContinuityComponent', () => {
  let component: LetterOfContinuityComponent;
  let fixture: ComponentFixture<LetterOfContinuityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
