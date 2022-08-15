import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedIndividualComponent } from './loan-deed-individual.component';

describe('LoanDeedIndividualComponent', () => {
  let component: LoanDeedIndividualComponent;
  let fixture: ComponentFixture<LoanDeedIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
