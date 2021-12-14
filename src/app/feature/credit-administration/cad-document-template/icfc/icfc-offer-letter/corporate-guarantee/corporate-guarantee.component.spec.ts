import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorporateGuaranteeComponent } from './corporate-guarantee.component';

describe('CorporateGuaranteeComponent', () => {
  let component: CorporateGuaranteeComponent;
  let fixture: ComponentFixture<CorporateGuaranteeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateGuaranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
