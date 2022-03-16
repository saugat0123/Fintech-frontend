import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailFinancialPerformanceComponent } from './retail-financial-performance.component';

describe('RetailFinancialPerformanceComponent', () => {
  let component: RetailFinancialPerformanceComponent;
  let fixture: ComponentFixture<RetailFinancialPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailFinancialPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailFinancialPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
