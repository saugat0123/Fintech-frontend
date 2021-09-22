import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailHousingLoanTemplateDataComponent } from './retail-housing-loan-template-data.component';

describe('RetailHousingLoanTemplateDataComponent', () => {
  let component: RetailHousingLoanTemplateDataComponent;
  let fixture: ComponentFixture<RetailHousingLoanTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailHousingLoanTemplateDataComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailHousingLoanTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
