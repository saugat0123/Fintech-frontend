import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LetterOfLeinPrintComponent} from './letter-of-lein-print.component';

describe('LetterOfLeinPrintComponent', () => {
  let component: LetterOfLeinPrintComponent;
  let fixture: ComponentFixture<LetterOfLeinPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfLeinPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfLeinPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
