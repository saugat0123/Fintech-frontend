import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanCombinedTemplateDataComponent } from './auto-loan-combined-template-data.component';

describe('AutoLoanCombinedTemplateDataComponent', () => {
  let component: AutoLoanCombinedTemplateDataComponent;
  let fixture: ComponentFixture<AutoLoanCombinedTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanCombinedTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanCombinedTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
