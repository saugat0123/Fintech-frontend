import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaraneeJointBorrowerComponent } from './personal-guaranee-joint-borrower.component';

describe('PersonalGuaraneeJointBorrowerComponent', () => {
  let component: PersonalGuaraneeJointBorrowerComponent;
  let fixture: ComponentFixture<PersonalGuaraneeJointBorrowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaraneeJointBorrowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaraneeJointBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
