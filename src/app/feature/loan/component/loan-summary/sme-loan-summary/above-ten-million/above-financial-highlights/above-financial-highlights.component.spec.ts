import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveFinancialHighlightsComponent } from './above-financial-highlights.component';

describe('AboveFinancialHighlightsComponent', () => {
  let component: AboveFinancialHighlightsComponent;
  let fixture: ComponentFixture<AboveFinancialHighlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveFinancialHighlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveFinancialHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
