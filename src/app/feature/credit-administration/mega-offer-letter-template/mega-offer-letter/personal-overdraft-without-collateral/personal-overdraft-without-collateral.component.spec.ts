import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftWithoutCollateralComponent } from './personal-overdraft-without-collateral.component';

describe('PersonalOverdraftWithoutCollateralComponent', () => {
  let component: PersonalOverdraftWithoutCollateralComponent;
  let fixture: ComponentFixture<PersonalOverdraftWithoutCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftWithoutCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftWithoutCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
