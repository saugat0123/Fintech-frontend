import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LetterOfContinuityIcfcComponent } from './letter-of-continuity-icfc.component';

describe('LetterOfContinuityIcfcComponent', () => {
  let component: LetterOfContinuityIcfcComponent;
  let fixture: ComponentFixture<LetterOfContinuityIcfcComponent>;

  beforeEach(waitForAsync(() => {
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
