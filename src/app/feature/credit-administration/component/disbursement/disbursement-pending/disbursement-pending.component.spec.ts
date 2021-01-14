import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementPendingComponent } from './disbursement-pending.component';

describe('DisbursementPendingComponent', () => {
  let component: DisbursementPendingComponent;
  let fixture: ComponentFixture<DisbursementPendingComponent>;

  beforeEach(async(() => {
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
