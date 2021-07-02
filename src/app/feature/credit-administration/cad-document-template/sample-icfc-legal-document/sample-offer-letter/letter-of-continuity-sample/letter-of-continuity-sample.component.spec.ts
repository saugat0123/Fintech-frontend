import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuitySampleComponent } from './letter-of-continuity-sample.component';

describe('LetterOfContinuitySampleComponent', () => {
  let component: LetterOfContinuitySampleComponent;
  let fixture: ComponentFixture<LetterOfContinuitySampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuitySampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuitySampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
