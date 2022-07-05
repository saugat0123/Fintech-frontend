import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePolicyComponent } from './insurance-policy.component';

describe('InsurancePolicyComponent', () => {
  let component: InsurancePolicyComponent;
  let fixture: ComponentFixture<InsurancePolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
