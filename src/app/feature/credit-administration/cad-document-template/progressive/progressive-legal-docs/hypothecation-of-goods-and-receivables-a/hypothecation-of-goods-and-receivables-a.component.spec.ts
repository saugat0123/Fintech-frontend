import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HypothecationOfGoodsAndReceivablesAComponent } from './hypothecation-of-goods-and-receivables-a.component';

describe('HypothecationOfGoodsAndReceivablesAComponent', () => {
  let component: HypothecationOfGoodsAndReceivablesAComponent;
  let fixture: ComponentFixture<HypothecationOfGoodsAndReceivablesAComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothecationOfGoodsAndReceivablesAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothecationOfGoodsAndReceivablesAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
