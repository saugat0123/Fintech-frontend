import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeSecurityComponent } from './personal-guarantee-security.component';

describe('PersonalGuaranteeSecurityComponent', () => {
  let component: PersonalGuaranteeSecurityComponent;
  let fixture: ComponentFixture<PersonalGuaranteeSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
