import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginCallDeedShareCompanyPrintComponent } from './margin-call-deed-share-company-print.component';

describe('MarginCallDeedShareCompanyPrintComponent', () => {
  let component: MarginCallDeedShareCompanyPrintComponent;
  let fixture: ComponentFixture<MarginCallDeedShareCompanyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginCallDeedShareCompanyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginCallDeedShareCompanyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
