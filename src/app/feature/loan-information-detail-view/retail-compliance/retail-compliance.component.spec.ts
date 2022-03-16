import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailComplianceComponent } from './retail-compliance.component';

describe('RetailComplianceComponent', () => {
  let component: RetailComplianceComponent;
  let fixture: ComponentFixture<RetailComplianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailComplianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
