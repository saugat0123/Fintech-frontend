import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfLeinPrintComponent } from './letter-of-lein-print.component';

describe('LetterOfLeinPrintComponent', () => {
  let component: LetterOfLeinPrintComponent;
  let fixture: ComponentFixture<LetterOfLeinPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfLeinPrintComponent ]
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
