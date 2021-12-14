import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LetterOfContinuityComponent} from './letter-of-continuity.component';

describe('LetterOfContinuityComponent', () => {
  let component: LetterOfContinuityComponent;
  let fixture: ComponentFixture<LetterOfContinuityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfContinuityComponent]
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
