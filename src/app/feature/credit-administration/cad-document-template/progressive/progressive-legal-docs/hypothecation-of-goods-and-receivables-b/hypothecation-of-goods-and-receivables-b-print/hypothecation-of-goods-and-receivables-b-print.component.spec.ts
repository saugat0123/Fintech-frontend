import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HypothecationOfGoodsAndReceivablesBPrintComponent } from './hypothecation-of-goods-and-receivables-b-print.component';

describe('HypothecationOfGoodsAndReceivablesBPrintComponent', () => {
  let component: HypothecationOfGoodsAndReceivablesBPrintComponent;
  let fixture: ComponentFixture<HypothecationOfGoodsAndReceivablesBPrintComponent>;

  beforeEach(waitForAsync(() => {
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
