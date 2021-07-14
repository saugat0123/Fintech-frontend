import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityIcfcComponent } from './letter-of-continuity-icfc.component';

describe('LetterOfContinuityIcfcComponent', () => {
  let component: LetterOfContinuityIcfcComponent;
  let fixture: ComponentFixture<LetterOfContinuityIcfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
