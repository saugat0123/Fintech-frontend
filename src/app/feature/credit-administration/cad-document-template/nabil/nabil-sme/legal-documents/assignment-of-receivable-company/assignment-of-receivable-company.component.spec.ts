import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOfReceivableCompanyComponent } from './assignment-of-receivable-company.component';

describe('AssignmentOfReceivableCompanyComponent', () => {
  let component: AssignmentOfReceivableCompanyComponent;
  let fixture: ComponentFixture<AssignmentOfReceivableCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentOfReceivableCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOfReceivableCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
