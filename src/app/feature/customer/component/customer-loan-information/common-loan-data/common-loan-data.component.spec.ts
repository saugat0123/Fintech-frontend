import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLoanDataComponent } from './common-loan-data.component';

describe('CommonLoanDataComponent', () => {
  let component: CommonLoanDataComponent;
  let fixture: ComponentFixture<CommonLoanDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonLoanDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLoanDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
