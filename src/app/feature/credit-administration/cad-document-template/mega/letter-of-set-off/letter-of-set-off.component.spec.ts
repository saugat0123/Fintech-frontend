import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfSetOffComponent } from './letter-of-set-off.component';

describe('LetterOfSetOffComponent', () => {
  let component: LetterOfSetOffComponent;
  let fixture: ComponentFixture<LetterOfSetOffComponent>;

  beforeEach(async(() => {
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
