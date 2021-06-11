import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateGuaranteeSecurityComponent } from './corporate-guarantee-security.component';

describe('CorporateGuaranteeSecurityComponent', () => {
  let component: CorporateGuaranteeSecurityComponent;
  let fixture: ComponentFixture<CorporateGuaranteeSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateGuaranteeSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateGuaranteeSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
