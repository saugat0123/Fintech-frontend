import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LetterOfConfessionComponent } from './letter-of-confession.component';

describe('LetterOfConfessionComponent', () => {
  let component: LetterOfConfessionComponent;
  let fixture: ComponentFixture<LetterOfConfessionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfConfessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfConfessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
