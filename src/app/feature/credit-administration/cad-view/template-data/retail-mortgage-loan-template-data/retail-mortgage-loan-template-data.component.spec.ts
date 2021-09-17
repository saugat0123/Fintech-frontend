import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailMortgageLoanTemplateDataComponent } from './retail-mortgage-loan-template-data.component';

describe('RetailMortgageLoanTemplateDataComponent', () => {
  let component: RetailMortgageLoanTemplateDataComponent;
  let fixture: ComponentFixture<RetailMortgageLoanTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailMortgageLoanTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMortgageLoanTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
