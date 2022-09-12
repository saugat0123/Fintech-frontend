import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiCorporateGuaranteeComponent } from './kalo-suchi-corporate-guarantee.component';

describe('KaloSuchiCorporateGuaranteeComponent', () => {
  let component: KaloSuchiCorporateGuaranteeComponent;
  let fixture: ComponentFixture<KaloSuchiCorporateGuaranteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiCorporateGuaranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiCorporateGuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
