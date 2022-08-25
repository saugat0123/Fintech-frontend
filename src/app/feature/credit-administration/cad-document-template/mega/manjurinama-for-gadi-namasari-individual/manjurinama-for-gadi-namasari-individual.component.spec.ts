import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjurinamaForGadiNamasariIndividualComponent } from './manjurinama-for-gadi-namasari-individual.component';

describe('ManjurinamaForGadiNamasariIndividualComponent', () => {
  let component: ManjurinamaForGadiNamasariIndividualComponent;
  let fixture: ComponentFixture<ManjurinamaForGadiNamasariIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManjurinamaForGadiNamasariIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManjurinamaForGadiNamasariIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
