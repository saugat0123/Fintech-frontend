import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section8InsuranceClausePrintComponent } from './section8-insurance-clause-print.component';

describe('Section8InsuranceClausePrintComponent', () => {
  let component: Section8InsuranceClausePrintComponent;
  let fixture: ComponentFixture<Section8InsuranceClausePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section8InsuranceClausePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section8InsuranceClausePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
