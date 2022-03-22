import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoDetailsOfTheCustomerComponent } from './upto-details-of-the-customer.component';

describe('UptoDetailsOfTheCustomerComponent', () => {
  let component: UptoDetailsOfTheCustomerComponent;
  let fixture: ComponentFixture<UptoDetailsOfTheCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoDetailsOfTheCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoDetailsOfTheCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
