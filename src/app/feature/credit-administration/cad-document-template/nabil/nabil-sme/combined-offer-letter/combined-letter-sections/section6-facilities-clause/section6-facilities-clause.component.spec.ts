import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section6FacilitiesClauseComponent } from './section6-facilities-clause.component';

describe('Section6FacilitiesClauseComponent', () => {
  let component: Section6FacilitiesClauseComponent;
  let fixture: ComponentFixture<Section6FacilitiesClauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section6FacilitiesClauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section6FacilitiesClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
