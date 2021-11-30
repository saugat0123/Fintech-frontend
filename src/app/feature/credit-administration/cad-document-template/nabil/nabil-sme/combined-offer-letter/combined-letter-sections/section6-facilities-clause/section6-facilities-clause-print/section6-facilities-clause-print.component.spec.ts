import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section6FacilitiesClausePrintComponent } from './section6-facilities-clause-print.component';

describe('Section6FacilitiesClausePrintComponent', () => {
  let component: Section6FacilitiesClausePrintComponent;
  let fixture: ComponentFixture<Section6FacilitiesClausePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section6FacilitiesClausePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section6FacilitiesClausePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
