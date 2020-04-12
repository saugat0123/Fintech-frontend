import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSummaryComponent } from './insurance-summary.component';

describe('InsuranceSummaryComponent', () => {
  let component: InsuranceSummaryComponent;
  let fixture: ComponentFixture<InsuranceSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
