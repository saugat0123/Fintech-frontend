import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOfReceivableSecurityComponent } from './assignment-of-receivable-security.component';

describe('AssignmentOfReceivableSecurityComponent', () => {
  let component: AssignmentOfReceivableSecurityComponent;
  let fixture: ComponentFixture<AssignmentOfReceivableSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentOfReceivableSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOfReceivableSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
