import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalGuaranteePersonalBothPrintComponent } from './personal-guarantee-personal-both-print.component';

describe('PersonalGuaranteePersonalBothPrintComponent', () => {
  let component: PersonalGuaranteePersonalBothPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteePersonalBothPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteePersonalBothPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteePersonalBothPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
