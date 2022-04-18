import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section9InsuranceRelatedClausesComponent } from './section9-insurance-related-clauses.component';

describe('Section9InsuranceRelatedClausesComponent', () => {
  let component: Section9InsuranceRelatedClausesComponent;
  let fixture: ComponentFixture<Section9InsuranceRelatedClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section9InsuranceRelatedClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section9InsuranceRelatedClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
