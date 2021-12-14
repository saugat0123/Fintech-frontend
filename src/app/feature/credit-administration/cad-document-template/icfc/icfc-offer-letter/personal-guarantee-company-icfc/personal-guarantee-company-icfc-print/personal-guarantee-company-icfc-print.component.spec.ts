import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalGuaranteeCompanyIcfcPrintComponent } from './personal-guarantee-company-icfc-print.component';

describe('PersonalGuaranteeCompanyIcfcPrintComponent', () => {
  let component: PersonalGuaranteeCompanyIcfcPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteeCompanyIcfcPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeCompanyIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeCompanyIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
