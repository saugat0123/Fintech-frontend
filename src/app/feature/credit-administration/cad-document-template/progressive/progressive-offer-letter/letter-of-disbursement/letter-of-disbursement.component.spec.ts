import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfDisbursementComponent } from './letter-of-disbursement.component';

describe('LetterOfDisbursementComponent', () => {
  let component: LetterOfDisbursementComponent;
  let fixture: ComponentFixture<LetterOfDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
