import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOfReceivablePartnershipComponent } from './assignment-of-receivable-partnership.component';

describe('AssignmentOfReceivablePartnershipComponent', () => {
  let component: AssignmentOfReceivablePartnershipComponent;
  let fixture: ComponentFixture<AssignmentOfReceivablePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentOfReceivablePartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOfReceivablePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
