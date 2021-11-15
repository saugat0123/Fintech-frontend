import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailMortageLoanTemplateDataEditComponent } from './retail-mortage-loan-template-data-edit.component';

describe('RetailMortageLoanTemplateDataEditComponent', () => {
  let component: RetailMortageLoanTemplateDataEditComponent;
  let fixture: ComponentFixture<RetailMortageLoanTemplateDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailMortageLoanTemplateDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMortageLoanTemplateDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
