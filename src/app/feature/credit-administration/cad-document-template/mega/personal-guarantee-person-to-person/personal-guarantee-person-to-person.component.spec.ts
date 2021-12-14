import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalGuaranteePersonToPersonComponent } from './personal-guarantee-person-to-person.component';

describe('PersonalGuaranteePersonToPersonComponent', () => {
  let component: PersonalGuaranteePersonToPersonComponent;
  let fixture: ComponentFixture<PersonalGuaranteePersonToPersonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteePersonToPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteePersonToPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
