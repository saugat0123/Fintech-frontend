import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfArrangementsPrintComponent } from './letter-of-arrangements-print.component';

describe('LetterOfArrangementsPrintComponent', () => {
  let component: LetterOfArrangementsPrintComponent;
  let fixture: ComponentFixture<LetterOfArrangementsPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfArrangementsPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfArrangementsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
