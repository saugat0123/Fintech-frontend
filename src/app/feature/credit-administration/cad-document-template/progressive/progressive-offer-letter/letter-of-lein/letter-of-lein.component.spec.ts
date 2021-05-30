import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfLeinComponent } from './letter-of-lein.component';

describe('LetterOfLeinComponent', () => {
  let component: LetterOfLeinComponent;
  let fixture: ComponentFixture<LetterOfLeinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfLeinComponent ]
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
