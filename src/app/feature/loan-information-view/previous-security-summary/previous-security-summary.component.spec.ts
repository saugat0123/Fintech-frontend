import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousSecuritySummaryComponent } from './previous-security-summary.component';

describe('PreviousSecuritySummaryComponent', () => {
  let component: PreviousSecuritySummaryComponent;
  let fixture: ComponentFixture<PreviousSecuritySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousSecuritySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousSecuritySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
