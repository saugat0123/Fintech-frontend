import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailMortgagePrintComponent } from './retail-mortgage-print.component';

describe('RetailMortgagePrintComponent', () => {
  let component: RetailMortgagePrintComponent;
  let fixture: ComponentFixture<RetailMortgagePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailMortgagePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMortgagePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
