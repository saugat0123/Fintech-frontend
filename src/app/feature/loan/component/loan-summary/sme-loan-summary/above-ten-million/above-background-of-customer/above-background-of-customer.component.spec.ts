import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveBackgroundOfCustomerComponent } from './above-background-of-customer.component';

describe('AboveBackgroundOfCustomerComponent', () => {
  let component: AboveBackgroundOfCustomerComponent;
  let fixture: ComponentFixture<AboveBackgroundOfCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveBackgroundOfCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveBackgroundOfCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
