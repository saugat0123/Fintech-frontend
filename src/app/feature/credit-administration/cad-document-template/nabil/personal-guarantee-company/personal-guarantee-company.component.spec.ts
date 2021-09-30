import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeCompanyComponent } from './personal-guarantee-company.component';

describe('PersonalGuaranteeCompanyComponent', () => {
  let component: PersonalGuaranteeCompanyComponent;
  let fixture: ComponentFixture<PersonalGuaranteeCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
