import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeComponent } from './personal-guarantee.component';

describe('PersonalGuaranteeComponent', () => {
  let component: PersonalGuaranteeComponent;
  let fixture: ComponentFixture<PersonalGuaranteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
