import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanTemplateEditComponent } from './auto-loan-template-edit.component';

describe('AutoLoanTemplateEditComponent', () => {
  let component: AutoLoanTemplateEditComponent;
  let fixture: ComponentFixture<AutoLoanTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
