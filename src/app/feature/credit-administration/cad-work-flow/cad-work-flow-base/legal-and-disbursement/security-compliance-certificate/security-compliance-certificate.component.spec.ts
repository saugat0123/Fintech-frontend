import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComplianceCertificateComponent } from './security-compliance-certificate.component';

describe('SecurityComplianceCertificateComponent', () => {
  let component: SecurityComplianceCertificateComponent;
  let fixture: ComponentFixture<SecurityComplianceCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityComplianceCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComplianceCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
