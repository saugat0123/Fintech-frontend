import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section4LoanLimitComponent } from './section4-loan-limit.component';

describe('Section4LoanLimitComponent', () => {
  let component: Section4LoanLimitComponent;
  let fixture: ComponentFixture<Section4LoanLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section4LoanLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section4LoanLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
