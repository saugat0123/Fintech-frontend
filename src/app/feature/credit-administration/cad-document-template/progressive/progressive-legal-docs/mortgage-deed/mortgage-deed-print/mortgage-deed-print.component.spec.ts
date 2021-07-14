import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MortgageDeedPrintComponent} from './mortgage-deed-print.component';

describe('MortgageDeedPrintComponent', () => {
  let component: MortgageDeedPrintComponent;
  let fixture: ComponentFixture<MortgageDeedPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MortgageDeedPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageDeedPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
