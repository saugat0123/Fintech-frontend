import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfConfessionPrintComponent } from './letter-of-confession-print.component';

describe('LetterOfConfessionPrintComponent', () => {
  let component: LetterOfConfessionPrintComponent;
  let fixture: ComponentFixture<LetterOfConfessionPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfConfessionPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfConfessionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
