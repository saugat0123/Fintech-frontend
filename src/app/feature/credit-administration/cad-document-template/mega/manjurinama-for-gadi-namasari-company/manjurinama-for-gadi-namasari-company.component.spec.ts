import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjurinamaForGadiNamasariCompanyComponent } from './manjurinama-for-gadi-namasari-company.component';

describe('ManjurinamaForGadiNamasariCompanyComponent', () => {
  let component: ManjurinamaForGadiNamasariCompanyComponent;
  let fixture: ComponentFixture<ManjurinamaForGadiNamasariCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManjurinamaForGadiNamasariCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManjurinamaForGadiNamasariCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
