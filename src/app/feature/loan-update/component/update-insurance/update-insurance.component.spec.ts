import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateInsuranceComponent } from './update-insurance.component';

describe('UpdateInsuranceComponent', () => {
  let component: UpdateInsuranceComponent;
  let fixture: ComponentFixture<UpdateInsuranceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
