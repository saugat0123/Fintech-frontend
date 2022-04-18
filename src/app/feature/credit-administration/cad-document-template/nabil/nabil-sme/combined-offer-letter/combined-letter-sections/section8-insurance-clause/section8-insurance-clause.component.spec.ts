import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section8InsuranceClauseComponent } from './section8-insurance-clause.component';

describe('Section8InsuranceClauseComponent', () => {
  let component: Section8InsuranceClauseComponent;
  let fixture: ComponentFixture<Section8InsuranceClauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section8InsuranceClauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section8InsuranceClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
