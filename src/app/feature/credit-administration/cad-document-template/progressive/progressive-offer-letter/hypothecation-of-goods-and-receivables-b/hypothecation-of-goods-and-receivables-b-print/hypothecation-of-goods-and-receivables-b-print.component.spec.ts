import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothecationOfGoodsAndReceivablesBPrintComponent } from './hypothecation-of-goods-and-receivables-b-print.component';

describe('HypothecationOfGoodsAndReceivablesBPrintComponent', () => {
  let component: HypothecationOfGoodsAndReceivablesBPrintComponent;
  let fixture: ComponentFixture<HypothecationOfGoodsAndReceivablesBPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothecationOfGoodsAndReceivablesBPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothecationOfGoodsAndReceivablesBPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
