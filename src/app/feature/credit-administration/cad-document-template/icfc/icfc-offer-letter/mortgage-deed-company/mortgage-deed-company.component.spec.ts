import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageDeedCompanyComponent } from './mortgage-deed-company.component';

describe('MortgageDeedCompanyComponent', () => {
  let component: MortgageDeedCompanyComponent;
  let fixture: ComponentFixture<MortgageDeedCompanyComponent>;

  beforeEach(async(() => {
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
