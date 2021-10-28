import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedCorporateComponent } from './loan-deed-corporate.component';

describe('LoanDeedCorporateComponent', () => {
  let component: LoanDeedCorporateComponent;
  let fixture: ComponentFixture<LoanDeedCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
