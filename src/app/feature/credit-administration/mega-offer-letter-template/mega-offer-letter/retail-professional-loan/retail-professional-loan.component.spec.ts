import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailProfessionalLoanComponent } from './retail-professional-loan.component';

describe('RetailProfessionalLoanComponent', () => {
  let component: RetailProfessionalLoanComponent;
  let fixture: ComponentFixture<RetailProfessionalLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailProfessionalLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailProfessionalLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
