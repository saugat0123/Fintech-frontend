import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgFirmPrintComponent } from './pg-firm-print.component';

describe('PgFirmPrintComponent', () => {
  let component: PgFirmPrintComponent;
  let fixture: ComponentFixture<PgFirmPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgFirmPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgFirmPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
