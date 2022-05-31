import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSubOrdinateCompanyComponent } from './land-sub-ordinate-company.component';

describe('LandSubOrdinateCompanyComponent', () => {
  let component: LandSubOrdinateCompanyComponent;
  let fixture: ComponentFixture<LandSubOrdinateCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandSubOrdinateCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSubOrdinateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
