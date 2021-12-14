import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagCbsCustomerComponent } from './tag-cbs-customer.component';

describe('TagCbsCustomerComponent', () => {
  let component: TagCbsCustomerComponent;
  let fixture: ComponentFixture<TagCbsCustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagCbsCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagCbsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
