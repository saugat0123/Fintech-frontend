import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HypothecationOfGoodsAndReceivablesBComponent } from './hypothecation-of-goods-and-receivables-b.component';

describe('HypothecationOfGoodsAndReceivablesBComponent', () => {
  let component: HypothecationOfGoodsAndReceivablesBComponent;
  let fixture: ComponentFixture<HypothecationOfGoodsAndReceivablesBComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothecationOfGoodsAndReceivablesBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothecationOfGoodsAndReceivablesBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
