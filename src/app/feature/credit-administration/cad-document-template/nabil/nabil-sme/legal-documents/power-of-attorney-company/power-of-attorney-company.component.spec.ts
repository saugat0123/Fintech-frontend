import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerOfAttorneyCompanyComponent } from './power-of-attorney-company.component';

describe('PowerOfAttorneyCompanyComponent', () => {
  let component: PowerOfAttorneyCompanyComponent;
  let fixture: ComponentFixture<PowerOfAttorneyCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerOfAttorneyCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerOfAttorneyCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
