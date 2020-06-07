import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorSummaryComponent } from './guarantor-summary.component';

describe('GuarantorSummaryComponent', () => {
  let component: GuarantorSummaryComponent;
  let fixture: ComponentFixture<GuarantorSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
