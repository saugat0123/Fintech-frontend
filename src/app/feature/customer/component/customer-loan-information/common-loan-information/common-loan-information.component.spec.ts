import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLoanInformationComponent } from './common-loan-information.component';

describe('CommonLoanInformationComponent', () => {
  let component: CommonLoanInformationComponent;
  let fixture: ComponentFixture<CommonLoanInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonLoanInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLoanInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
