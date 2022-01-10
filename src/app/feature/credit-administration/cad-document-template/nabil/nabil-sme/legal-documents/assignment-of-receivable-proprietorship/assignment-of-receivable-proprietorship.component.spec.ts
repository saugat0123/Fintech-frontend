import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOfReceivableProprietorshipComponent } from './assignment-of-receivable-proprietorship.component';

describe('AssignmentOfReceivableProprietorshipComponent', () => {
  let component: AssignmentOfReceivableProprietorshipComponent;
  let fixture: ComponentFixture<AssignmentOfReceivableProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentOfReceivableProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOfReceivableProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
