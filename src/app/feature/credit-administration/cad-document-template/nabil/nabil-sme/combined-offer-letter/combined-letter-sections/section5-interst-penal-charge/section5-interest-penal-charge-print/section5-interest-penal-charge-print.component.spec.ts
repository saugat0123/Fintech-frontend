import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section5InterestPenalChargePrintComponent } from './section5-interest-penal-charge-print.component';

describe('Section5InterestPenalChargePrintComponent', () => {
  let component: Section5InterestPenalChargePrintComponent;
  let fixture: ComponentFixture<Section5InterestPenalChargePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section5InterestPenalChargePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section5InterestPenalChargePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
