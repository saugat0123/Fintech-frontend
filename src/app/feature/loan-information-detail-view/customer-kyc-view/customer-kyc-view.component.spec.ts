import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerKycViewComponent } from './customer-kyc-view.component';

describe('CustomerKycViewComponent', () => {
  let component: CustomerKycViewComponent;
  let fixture: ComponentFixture<CustomerKycViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerKycViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerKycViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
