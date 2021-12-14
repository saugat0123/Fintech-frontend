import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SitevistSummaryComponentComponent } from './sitevist-summary-component.component';

describe('SitevistSummaryComponentComponent', () => {
  let component: SitevistSummaryComponentComponent;
  let fixture: ComponentFixture<SitevistSummaryComponentComponent>;

  beforeEach(waitForAsync(() => {
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
