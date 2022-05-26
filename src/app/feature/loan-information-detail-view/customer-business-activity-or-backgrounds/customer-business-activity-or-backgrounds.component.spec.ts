import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBusinessActivityOrBackgroundsComponent } from './customer-business-activity-or-backgrounds.component';

describe('CustomerBusinessActivityOrBackgroundsComponent', () => {
  let component: CustomerBusinessActivityOrBackgroundsComponent;
  let fixture: ComponentFixture<CustomerBusinessActivityOrBackgroundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerBusinessActivityOrBackgroundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerBusinessActivityOrBackgroundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
