import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossGuaranteeCompanyComponent } from './cross-guarantee-company.component';

describe('CrossGuaranteeCompanyComponent', () => {
  let component: CrossGuaranteeCompanyComponent;
  let fixture: ComponentFixture<CrossGuaranteeCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossGuaranteeCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossGuaranteeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
