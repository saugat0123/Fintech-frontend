import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LetterOfLeinComponent} from './letter-of-lein.component';

describe('LetterOfLeinComponent', () => {
  let component: LetterOfLeinComponent;
  let fixture: ComponentFixture<LetterOfLeinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfLeinComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfLeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
