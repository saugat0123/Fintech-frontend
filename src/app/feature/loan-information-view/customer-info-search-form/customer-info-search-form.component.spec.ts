import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerInfoSearchFormComponent } from './customer-info-search-form.component';

describe('CustomerInfoSearchFormComponent', () => {
  let component: CustomerInfoSearchFormComponent;
  let fixture: ComponentFixture<CustomerInfoSearchFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInfoSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInfoSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
