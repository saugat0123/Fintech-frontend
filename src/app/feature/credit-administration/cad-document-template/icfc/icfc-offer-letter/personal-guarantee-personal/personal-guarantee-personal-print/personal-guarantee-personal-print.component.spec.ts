import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalGuaranteePersonalPrintComponent } from './personal-guarantee-personal-print.component';

describe('PersonalGuaranteePersonalPrintComponent', () => {
  let component: PersonalGuaranteePersonalPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteePersonalPrintComponent>;

  beforeEach(waitForAsync(() => {
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
