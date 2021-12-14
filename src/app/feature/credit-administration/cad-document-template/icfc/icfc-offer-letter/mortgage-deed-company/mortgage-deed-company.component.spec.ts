import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MortgageDeedCompanyComponent } from './mortgage-deed-company.component';

describe('MortgageDeedCompanyComponent', () => {
  let component: MortgageDeedCompanyComponent;
  let fixture: ComponentFixture<MortgageDeedCompanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageDeedCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageDeedCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
