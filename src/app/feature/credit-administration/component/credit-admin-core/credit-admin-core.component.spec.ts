import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAdminCoreComponent } from './credit-admin-core.component';

describe('CreditAdminCoreComponent', () => {
  let component: CreditAdminCoreComponent;
  let fixture: ComponentFixture<CreditAdminCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditAdminCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditAdminCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
