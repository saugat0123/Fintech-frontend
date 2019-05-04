import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLoanComponent } from './pending-loan.component';

describe('PendingLoanComponent', () => {
  let component: PendingLoanComponent;
  let fixture: ComponentFixture<PendingLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
