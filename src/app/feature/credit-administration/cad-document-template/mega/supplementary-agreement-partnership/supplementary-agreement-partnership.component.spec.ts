import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryAgreementPartnershipComponent } from './supplementary-agreement-partnership.component';

describe('SupplementaryAgreementPartnershipComponent', () => {
  let component: SupplementaryAgreementPartnershipComponent;
  let fixture: ComponentFixture<SupplementaryAgreementPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementaryAgreementPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryAgreementPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
