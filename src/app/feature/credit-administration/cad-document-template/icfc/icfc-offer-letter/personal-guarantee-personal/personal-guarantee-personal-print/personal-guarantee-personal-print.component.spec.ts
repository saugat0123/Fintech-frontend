import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteePersonalPrintComponent } from './personal-guarantee-personal-print.component';

describe('PersonalGuaranteePersonalPrintComponent', () => {
  let component: PersonalGuaranteePersonalPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteePersonalPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteePersonalPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteePersonalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
