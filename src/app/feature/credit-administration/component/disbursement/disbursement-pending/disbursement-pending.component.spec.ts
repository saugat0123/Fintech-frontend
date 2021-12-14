import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisbursementPendingComponent } from './disbursement-pending.component';

describe('DisbursementPendingComponent', () => {
  let component: DisbursementPendingComponent;
  let fixture: ComponentFixture<DisbursementPendingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
