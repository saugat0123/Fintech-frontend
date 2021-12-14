import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LetterOfSetOffComponent } from './letter-of-set-off.component';

describe('LetterOfSetOffComponent', () => {
  let component: LetterOfSetOffComponent;
  let fixture: ComponentFixture<LetterOfSetOffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfSetOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfSetOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
