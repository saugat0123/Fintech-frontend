import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothecationOfGoodsAndReceivablesBComponent } from './hypothecation-of-goods-and-receivables-b.component';

describe('HypothecationOfGoodsAndReceivablesBComponent', () => {
  let component: HypothecationOfGoodsAndReceivablesBComponent;
  let fixture: ComponentFixture<HypothecationOfGoodsAndReceivablesBComponent>;

  beforeEach(async(() => {
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
