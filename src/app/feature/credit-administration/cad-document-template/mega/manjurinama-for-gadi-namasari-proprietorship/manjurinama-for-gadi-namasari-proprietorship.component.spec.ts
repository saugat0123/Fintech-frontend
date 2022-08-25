import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjurinamaForGadiNamasariProprietorshipComponent } from './manjurinama-for-gadi-namasari-proprietorship.component';

describe('ManjurinamaForGadiNamasariProprietorshipComponent', () => {
  let component: ManjurinamaForGadiNamasariProprietorshipComponent;
  let fixture: ComponentFixture<ManjurinamaForGadiNamasariProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManjurinamaForGadiNamasariProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManjurinamaForGadiNamasariProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
