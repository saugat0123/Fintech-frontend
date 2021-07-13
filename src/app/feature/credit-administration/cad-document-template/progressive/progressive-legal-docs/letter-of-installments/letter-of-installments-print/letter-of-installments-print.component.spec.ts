import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LetterOfInstallmentsPrintComponent} from './letter-of-installments-print.component';

describe('LetterOfInstallmentsPrintComponent', () => {
  let component: LetterOfInstallmentsPrintComponent;
  let fixture: ComponentFixture<LetterOfInstallmentsPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfInstallmentsPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfInstallmentsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
