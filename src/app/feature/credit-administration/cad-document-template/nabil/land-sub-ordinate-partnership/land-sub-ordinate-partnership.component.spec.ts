import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSubOrdinatePartnershipComponent } from './land-sub-ordinate-partnership.component';

describe('LandSubOrdinatePartnershipComponent', () => {
  let component: LandSubOrdinatePartnershipComponent;
  let fixture: ComponentFixture<LandSubOrdinatePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandSubOrdinatePartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSubOrdinatePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
