import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanCommercialTemplateDataComponent } from './auto-loan-commercial-template-data.component';

describe('AutoLoanCommercialTemplateDataComponent', () => {
  let component: AutoLoanCommercialTemplateDataComponent;
  let fixture: ComponentFixture<AutoLoanCommercialTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanCommercialTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanCommercialTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
