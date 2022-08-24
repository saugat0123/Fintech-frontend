import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOfReceivablesPartnershipComponent } from './assignment-of-receivables-partnership.component';

describe('AssignmentOfReceivablesPartnershipComponent', () => {
  let component: AssignmentOfReceivablesPartnershipComponent;
  let fixture: ComponentFixture<AssignmentOfReceivablesPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentOfReceivablesPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOfReceivablesPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
