import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSecuritySummaryComponent } from './share-security-summary.component';

describe('ShareSecuritySummaryComponent', () => {
  let component: ShareSecuritySummaryComponent;
  let fixture: ComponentFixture<ShareSecuritySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSecuritySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSecuritySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
