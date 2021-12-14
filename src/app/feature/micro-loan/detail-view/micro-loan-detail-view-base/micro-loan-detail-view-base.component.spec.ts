import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroLoanDetailViewBaseComponent } from './micro-loan-detail-view-base.component';

describe('MicroLoanDetailViewBaseComponent', () => {
  let component: MicroLoanDetailViewBaseComponent;
  let fixture: ComponentFixture<MicroLoanDetailViewBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroLoanDetailViewBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroLoanDetailViewBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
