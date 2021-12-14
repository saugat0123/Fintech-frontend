import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LetterOfArrangementsPrintComponent} from './letter-of-arrangements-print.component';

describe('LetterOfArrangementsPrintComponent', () => {
  let component: LetterOfArrangementsPrintComponent;
  let fixture: ComponentFixture<LetterOfArrangementsPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfArrangementsPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfArrangementsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
