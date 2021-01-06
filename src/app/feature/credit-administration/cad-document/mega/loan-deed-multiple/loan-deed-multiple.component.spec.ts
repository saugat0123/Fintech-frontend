import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedJointComponent } from './loan-deed-multiple.component';

describe('LoanDeedJointComponent', () => {
  let component: LoanDeedJointComponent;
  let fixture: ComponentFixture<LoanDeedJointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedJointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedJointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
