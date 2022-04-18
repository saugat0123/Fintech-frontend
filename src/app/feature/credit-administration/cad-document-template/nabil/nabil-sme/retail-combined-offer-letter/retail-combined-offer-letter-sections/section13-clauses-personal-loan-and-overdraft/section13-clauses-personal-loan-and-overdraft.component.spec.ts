import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section13ClausesPersonalLoanAndOverdraftComponent } from './section13-clauses-personal-loan-and-overdraft.component';

describe('Section13ClausesPersonalLoanAndOverdraftComponent', () => {
  let component: Section13ClausesPersonalLoanAndOverdraftComponent;
  let fixture: ComponentFixture<Section13ClausesPersonalLoanAndOverdraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section13ClausesPersonalLoanAndOverdraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section13ClausesPersonalLoanAndOverdraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
