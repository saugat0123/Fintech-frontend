import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftWithoutCollateralPrintComponent } from './personal-overdraft-without-collateral-print.component';

describe('PersonalOverdraftWithoutCollateralPrintComponent', () => {
  let component: PersonalOverdraftWithoutCollateralPrintComponent;
  let fixture: ComponentFixture<PersonalOverdraftWithoutCollateralPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftWithoutCollateralPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftWithoutCollateralPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
