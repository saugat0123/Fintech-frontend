import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonAddressComponent } from './common-address.component';

describe('CommonAddressComponent', () => {
  let component: CommonAddressComponent;
  let fixture: ComponentFixture<CommonAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
