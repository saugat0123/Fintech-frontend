import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeJointBorrowerComponent } from './personal-guarantee-joint-borrower.component';

describe('PersonalGuaranteeJointBorrowerComponent', () => {
  let component: PersonalGuaranteeJointBorrowerComponent;
  let fixture: ComponentFixture<PersonalGuaranteeJointBorrowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeJointBorrowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeJointBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
