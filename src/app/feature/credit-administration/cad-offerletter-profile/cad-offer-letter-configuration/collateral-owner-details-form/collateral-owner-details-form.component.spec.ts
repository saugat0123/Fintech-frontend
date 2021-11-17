import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralOwnerDetailsFormComponent } from './collateral-owner-details-form.component';

describe('CollateralOwnerDetailsFormComponent', () => {
  let component: CollateralOwnerDetailsFormComponent;
  let fixture: ComponentFixture<CollateralOwnerDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralOwnerDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralOwnerDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
