import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section10ExtraChargesRelatedClausesComponent } from './section10-extra-charges-related-clauses.component';

describe('Section10ExtraChargesRelatedClausesComponent', () => {
  let component: Section10ExtraChargesRelatedClausesComponent;
  let fixture: ComponentFixture<Section10ExtraChargesRelatedClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section10ExtraChargesRelatedClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section10ExtraChargesRelatedClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
