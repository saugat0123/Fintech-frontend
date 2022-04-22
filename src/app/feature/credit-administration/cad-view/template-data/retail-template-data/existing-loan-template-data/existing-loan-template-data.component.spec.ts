import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingLoanTemplateDataComponent } from './existing-loan-template-data.component';

describe('ExistingLoanTemplateDataComponent', () => {
  let component: ExistingLoanTemplateDataComponent;
  let fixture: ComponentFixture<ExistingLoanTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingLoanTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingLoanTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
