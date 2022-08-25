import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryAgreementCompanyComponent } from './supplementary-agreement-company.component';

describe('SupplementaryAgreementCompanyComponent', () => {
  let component: SupplementaryAgreementCompanyComponent;
  let fixture: ComponentFixture<SupplementaryAgreementCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementaryAgreementCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryAgreementCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
