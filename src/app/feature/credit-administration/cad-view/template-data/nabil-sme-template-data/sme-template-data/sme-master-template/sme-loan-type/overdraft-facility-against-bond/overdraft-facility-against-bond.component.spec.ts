import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftFacilityAgainstBondComponent } from './overdraft-facility-against-bond.component';

describe('OverdraftFacilityAgainstBondComponent', () => {
  let component: OverdraftFacilityAgainstBondComponent;
  let fixture: ComponentFixture<OverdraftFacilityAgainstBondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdraftFacilityAgainstBondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftFacilityAgainstBondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
