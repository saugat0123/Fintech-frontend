import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOfReceivablesProprietorshipComponent } from './assignment-of-receivables-proprietorship.component';

describe('AssignmentOfReceivablesProprietorshipComponent', () => {
  let component: AssignmentOfReceivablesProprietorshipComponent;
  let fixture: ComponentFixture<AssignmentOfReceivablesProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentOfReceivablesProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOfReceivablesProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
