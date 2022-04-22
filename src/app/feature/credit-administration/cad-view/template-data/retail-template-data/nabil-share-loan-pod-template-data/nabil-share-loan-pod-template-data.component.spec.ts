import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NabilShareLoanPodTemplateDataComponent } from './nabil-share-loan-pod-template-data.component';

describe('NabilShareLoanPodTemplateDataComponent', () => {
  let component: NabilShareLoanPodTemplateDataComponent;
  let fixture: ComponentFixture<NabilShareLoanPodTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NabilShareLoanPodTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NabilShareLoanPodTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
