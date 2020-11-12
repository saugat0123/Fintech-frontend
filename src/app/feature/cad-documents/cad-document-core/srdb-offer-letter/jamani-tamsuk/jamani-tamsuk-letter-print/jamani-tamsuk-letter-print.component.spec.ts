import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JamaniTamsukLetterPrintComponent} from './jamani-tamsuk-letter-print.component';

describe('JamaniTamsukLetterPrintComponent', () => {
  let component: JamaniTamsukLetterPrintComponent;
  let fixture: ComponentFixture<JamaniTamsukLetterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JamaniTamsukLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamaniTamsukLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
