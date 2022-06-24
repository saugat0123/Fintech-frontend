import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerShareSummaryComponent } from './customer-share-summary.component';

describe('CustomerShareSummaryComponent', () => {
  let component: CustomerShareSummaryComponent;
  let fixture: ComponentFixture<CustomerShareSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerShareSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerShareSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
