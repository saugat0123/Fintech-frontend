import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageLoanCombinedTemplateDataComponent } from './mortgage-loan-combined-template-data.component';

describe('MortgageLoanCombinedTemplateDataComponent', () => {
  let component: MortgageLoanCombinedTemplateDataComponent;
  let fixture: ComponentFixture<MortgageLoanCombinedTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageLoanCombinedTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageLoanCombinedTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
