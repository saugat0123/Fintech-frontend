import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfSetOffPrintComponent } from './letter-of-set-off-print.component';

describe('LetterOfSetOffPrintComponent', () => {
  let component: LetterOfSetOffPrintComponent;
  let fixture: ComponentFixture<LetterOfSetOffPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfSetOffPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfSetOffPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
