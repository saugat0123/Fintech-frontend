import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section5InterestRatedRelatedClausesComponent } from './section5-interest-rated-related-clauses.component';

describe('Section5InterestRatedRelatedClausesComponent', () => {
  let component: Section5InterestRatedRelatedClausesComponent;
  let fixture: ComponentFixture<Section5InterestRatedRelatedClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section5InterestRatedRelatedClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section5InterestRatedRelatedClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
