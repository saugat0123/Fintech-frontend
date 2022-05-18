import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothecationOfStockComponent } from './hypothecation-of-stock.component';

describe('HypothecationOfStockComponent', () => {
  let component: HypothecationOfStockComponent;
  let fixture: ComponentFixture<HypothecationOfStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothecationOfStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothecationOfStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
