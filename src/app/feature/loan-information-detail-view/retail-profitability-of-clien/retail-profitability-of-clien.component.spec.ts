import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailProfitabilityOfClienComponent } from './retail-profitability-of-clien.component';

describe('RetailProfitabilityOfClienComponent', () => {
  let component: RetailProfitabilityOfClienComponent;
  let fixture: ComponentFixture<RetailProfitabilityOfClienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailProfitabilityOfClienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailProfitabilityOfClienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
