import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareLoanDemandTemplateDataComponent } from './share-loan-demand-template-data.component';

describe('ShareLoanDemandTemplateDataComponent', () => {
  let component: ShareLoanDemandTemplateDataComponent;
  let fixture: ComponentFixture<ShareLoanDemandTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareLoanDemandTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLoanDemandTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
