import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveRequestOfTheCustomerComponent } from './above-request-of-the-customer.component';

describe('AboveRequestOfTheCustomerComponent', () => {
  let component: AboveRequestOfTheCustomerComponent;
  let fixture: ComponentFixture<AboveRequestOfTheCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveRequestOfTheCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveRequestOfTheCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
