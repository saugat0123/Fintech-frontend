import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteePersonalComponent } from './personal-guarantee-personal.component';

describe('PersonalGuaranteePersonalComponent', () => {
  let component: PersonalGuaranteePersonalComponent;
  let fixture: ComponentFixture<PersonalGuaranteePersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteePersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteePersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
