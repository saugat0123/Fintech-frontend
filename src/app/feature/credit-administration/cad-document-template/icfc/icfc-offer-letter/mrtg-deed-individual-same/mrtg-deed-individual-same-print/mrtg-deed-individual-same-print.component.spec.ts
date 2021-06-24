import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtgDeedIndividualSamePrintComponent } from './mrtg-deed-individual-same-print.component';

describe('MrtgDeedIndividualSamePrintComponent', () => {
  let component: MrtgDeedIndividualSamePrintComponent;
  let fixture: ComponentFixture<MrtgDeedIndividualSamePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrtgDeedIndividualSamePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrtgDeedIndividualSamePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
