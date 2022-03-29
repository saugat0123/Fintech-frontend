import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNamsariLetterForHpLoanComponent } from './vehicle-namsari-letter-for-hp-loan.component';

describe('VehicleNamsariLetterForHpLoanComponent', () => {
  let component: VehicleNamsariLetterForHpLoanComponent;
  let fixture: ComponentFixture<VehicleNamsariLetterForHpLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleNamsariLetterForHpLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNamsariLetterForHpLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
