import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePolicySecurityComponent } from './insurance-policy-security.component';

describe('InsurancePolicySecurityComponent', () => {
  let component: InsurancePolicySecurityComponent;
  let fixture: ComponentFixture<InsurancePolicySecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancePolicySecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePolicySecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
