import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerInfoNepaliComponent } from './customer-info-nepali.component';

describe('CustomerInfoNepaliComponent', () => {
  let component: CustomerInfoNepaliComponent;
  let fixture: ComponentFixture<CustomerInfoNepaliComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInfoNepaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInfoNepaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
