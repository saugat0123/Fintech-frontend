import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrevocableLetterOfCreditFacilityComponent } from './irrevocable-letter-of-credit-facility.component';

describe('IrrevocableLetterOfCreditFacilityComponent', () => {
  let component: IrrevocableLetterOfCreditFacilityComponent;
  let fixture: ComponentFixture<IrrevocableLetterOfCreditFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrrevocableLetterOfCreditFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrrevocableLetterOfCreditFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
