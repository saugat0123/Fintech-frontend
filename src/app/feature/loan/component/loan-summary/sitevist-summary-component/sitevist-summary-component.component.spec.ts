import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevistSummaryComponentComponent } from './sitevist-summary-component.component';

describe('SitevistSummaryComponentComponent', () => {
  let component: SitevistSummaryComponentComponent;
  let fixture: ComponentFixture<SitevistSummaryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitevistSummaryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitevistSummaryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
