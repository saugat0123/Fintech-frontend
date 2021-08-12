import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypoOfStockComponent } from './hypo-of-stock.component';

describe('HypoOfStockComponent', () => {
  let component: HypoOfStockComponent;
  let fixture: ComponentFixture<HypoOfStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypoOfStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypoOfStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
