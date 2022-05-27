import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNetWorthViewComponent } from './customer-net-worth-view.component';

describe('CustomerNetWorthViewComponent', () => {
  let component: CustomerNetWorthViewComponent;
  let fixture: ComponentFixture<CustomerNetWorthViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerNetWorthViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerNetWorthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
