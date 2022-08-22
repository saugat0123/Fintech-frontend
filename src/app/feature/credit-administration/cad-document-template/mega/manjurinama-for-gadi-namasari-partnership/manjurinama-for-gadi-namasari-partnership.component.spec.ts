import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjurinamaForGadiNamasariPartnershipComponent } from './manjurinama-for-gadi-namasari-partnership.component';

describe('ManjurinamaForGadiNamasariPartnershipComponent', () => {
  let component: ManjurinamaForGadiNamasariPartnershipComponent;
  let fixture: ComponentFixture<ManjurinamaForGadiNamasariPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManjurinamaForGadiNamasariPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManjurinamaForGadiNamasariPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
