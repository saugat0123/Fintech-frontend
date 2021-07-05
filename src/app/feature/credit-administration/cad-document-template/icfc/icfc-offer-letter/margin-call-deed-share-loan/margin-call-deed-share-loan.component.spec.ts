import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginCallDeedShareLoanComponent } from './margin-call-deed-share-loan.component';

describe('MarginCallDeedShareLoanComponent', () => {
  let component: MarginCallDeedShareLoanComponent;
  let fixture: ComponentFixture<MarginCallDeedShareLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginCallDeedShareLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginCallDeedShareLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
