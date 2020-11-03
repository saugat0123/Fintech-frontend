import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInformationDetailViewComponent } from './loan-information-detail-view.component';

describe('LoanInformationDetailViewComponent', () => {
  let component: LoanInformationDetailViewComponent;
  let fixture: ComponentFixture<LoanInformationDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanInformationDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanInformationDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
