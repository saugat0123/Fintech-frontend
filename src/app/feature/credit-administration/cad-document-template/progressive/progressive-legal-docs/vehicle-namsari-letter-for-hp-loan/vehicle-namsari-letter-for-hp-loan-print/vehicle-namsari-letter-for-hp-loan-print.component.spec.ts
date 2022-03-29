import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNamsariLetterForHpLoanPrintComponent } from './vehicle-namsari-letter-for-hp-loan-print.component';

describe('VehicleNamsariLetterForHpLoanPrintComponent', () => {
  let component: VehicleNamsariLetterForHpLoanPrintComponent;
  let fixture: ComponentFixture<VehicleNamsariLetterForHpLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleNamsariLetterForHpLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNamsariLetterForHpLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
