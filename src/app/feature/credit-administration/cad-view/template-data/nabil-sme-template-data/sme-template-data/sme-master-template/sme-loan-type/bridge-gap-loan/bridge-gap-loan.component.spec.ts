import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeGapLoanComponent } from './bridge-gap-loan.component';

describe('BridgeGapLoanComponent', () => {
  let component: BridgeGapLoanComponent;
  let fixture: ComponentFixture<BridgeGapLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BridgeGapLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgeGapLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
