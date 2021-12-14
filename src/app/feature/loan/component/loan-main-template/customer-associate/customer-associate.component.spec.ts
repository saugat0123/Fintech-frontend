import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerAssociateComponent } from './customer-associate.component';

describe('CustomerAssociateComponent', () => {
  let component: CustomerAssociateComponent;
  let fixture: ComponentFixture<CustomerAssociateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAssociateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAssociateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
