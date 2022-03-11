import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveWaiverDeviationsDeferalsRebatesComponent } from './above-waiver-deviations-deferals-rebates.component';

describe('AboveWaiverDeviationsDeferalsRebatesComponent', () => {
  let component: AboveWaiverDeviationsDeferalsRebatesComponent;
  let fixture: ComponentFixture<AboveWaiverDeviationsDeferalsRebatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveWaiverDeviationsDeferalsRebatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveWaiverDeviationsDeferalsRebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
