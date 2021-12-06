import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdyamsilKarjaSubsidyPrintComponent } from './udyamsil-karja-subsidy-print.component';

describe('UdyamsilKarjaSubsidyPrintComponent', () => {
  let component: UdyamsilKarjaSubsidyPrintComponent;
  let fixture: ComponentFixture<UdyamsilKarjaSubsidyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdyamsilKarjaSubsidyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdyamsilKarjaSubsidyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
