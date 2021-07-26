import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeCompanyIcfcPrintComponent } from './personal-guarantee-company-icfc-print.component';

describe('PersonalGuaranteeCompanyIcfcPrintComponent', () => {
  let component: PersonalGuaranteeCompanyIcfcPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteeCompanyIcfcPrintComponent>;

  beforeEach(async(() => {
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
