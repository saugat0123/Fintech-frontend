import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSourceOfRepaymentComponent } from './retail-source-of-repayment.component';

describe('RetailSourceOfRepaymentComponent', () => {
  let component: RetailSourceOfRepaymentComponent;
  let fixture: ComponentFixture<RetailSourceOfRepaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailSourceOfRepaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSourceOfRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
