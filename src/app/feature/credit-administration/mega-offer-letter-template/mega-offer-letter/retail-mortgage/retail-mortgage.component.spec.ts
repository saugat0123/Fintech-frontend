import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailMortgageComponent } from './retail-mortgage.component';

describe('RetailMortgageComponent', () => {
  let component: RetailMortgageComponent;
  let fixture: ComponentFixture<RetailMortgageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailMortgageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
