import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsViewCustomerComponent } from './cbs-view-customer.component';

describe('CbsViewCustomerComponent', () => {
  let component: CbsViewCustomerComponent;
  let fixture: ComponentFixture<CbsViewCustomerComponent>;

  beforeEach(async(() => {
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
