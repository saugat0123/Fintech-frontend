import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothecationOfGoodsAndReceivablesAPrintComponent } from './hypothecation-of-goods-and-receivables-a-print.component';

describe('HypothecationOfGoodsAndReceivablesAPrintComponent', () => {
  let component: HypothecationOfGoodsAndReceivablesAPrintComponent;
  let fixture: ComponentFixture<HypothecationOfGoodsAndReceivablesAPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothecationOfGoodsAndReceivablesAPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothecationOfGoodsAndReceivablesAPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
