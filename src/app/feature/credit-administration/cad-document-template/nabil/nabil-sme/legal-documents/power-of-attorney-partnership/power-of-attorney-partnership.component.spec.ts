import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerOfAttorneyPartnershipComponent } from './power-of-attorney-partnership.component';

describe('PowerOfAttorneyPartnershipComponent', () => {
  let component: PowerOfAttorneyPartnershipComponent;
  let fixture: ComponentFixture<PowerOfAttorneyPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerOfAttorneyPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerOfAttorneyPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
