import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBillsDiscountingComponent } from './import-bills-discounting.component';

describe('ImportBillsDiscountingComponent', () => {
  let component: ImportBillsDiscountingComponent;
  let fixture: ComponentFixture<ImportBillsDiscountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportBillsDiscountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBillsDiscountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
