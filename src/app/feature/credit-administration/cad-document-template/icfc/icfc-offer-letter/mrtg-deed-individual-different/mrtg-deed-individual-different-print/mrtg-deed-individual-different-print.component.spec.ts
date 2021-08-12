import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtgDeedIndividualDifferentPrintComponent } from './mrtg-deed-individual-different-print.component';

describe('MrtgDeedIndividualDifferentPrintComponent', () => {
  let component: MrtgDeedIndividualDifferentPrintComponent;
  let fixture: ComponentFixture<MrtgDeedIndividualDifferentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrtgDeedIndividualDifferentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrtgDeedIndividualDifferentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
