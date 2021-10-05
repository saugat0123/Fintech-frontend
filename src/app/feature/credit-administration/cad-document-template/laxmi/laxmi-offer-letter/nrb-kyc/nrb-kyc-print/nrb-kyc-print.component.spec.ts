import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrbKycPrintComponent } from './nrb-kyc-print.component';

describe('NrbKycPrintComponent', () => {
  let component: NrbKycPrintComponent;
  let fixture: ComponentFixture<NrbKycPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NrbKycPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrbKycPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
