import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalGuaranteeCompanyIcfcComponent } from './personal-guarantee-company-icfc.component';

describe('PersonalGuaranteeCompanyIcfcComponent', () => {
  let component: PersonalGuaranteeCompanyIcfcComponent;
  let fixture: ComponentFixture<PersonalGuaranteeCompanyIcfcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeCompanyIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeCompanyIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
