import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageDeedCorporatePrintComponent } from './mortgage-deed-corporate-print.component';

describe('MortgageDeedCorporatePrintComponent', () => {
  let component: MortgageDeedCorporatePrintComponent;
  let fixture: ComponentFixture<MortgageDeedCorporatePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageDeedCorporatePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageDeedCorporatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
