import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section11ExtraClausesForAutoLoanComponent } from './section11-extra-clauses-for-auto-loan.component';

describe('Section11ExtraClausesForAutoLoanComponent', () => {
  let component: Section11ExtraClausesForAutoLoanComponent;
  let fixture: ComponentFixture<Section11ExtraClausesForAutoLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section11ExtraClausesForAutoLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section11ExtraClausesForAutoLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
