import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossGuaranteePartnershipComponent } from './cross-guarantee-partnership.component';

describe('CrossGuaranteePartnershipComponent', () => {
  let component: CrossGuaranteePartnershipComponent;
  let fixture: ComponentFixture<CrossGuaranteePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossGuaranteePartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossGuaranteePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
