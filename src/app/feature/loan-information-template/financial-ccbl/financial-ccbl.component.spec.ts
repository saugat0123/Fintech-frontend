import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCcblComponent } from './financial-ccbl.component';

describe('FinancialCcblComponent', () => {
  let component: FinancialCcblComponent;
  let fixture: ComponentFixture<FinancialCcblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialCcblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCcblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
