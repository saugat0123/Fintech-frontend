import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CbsViewCustomerComponent } from './cbs-view-customer.component';

describe('CbsViewCustomerComponent', () => {
  let component: CbsViewCustomerComponent;
  let fixture: ComponentFixture<CbsViewCustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CbsViewCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsViewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
