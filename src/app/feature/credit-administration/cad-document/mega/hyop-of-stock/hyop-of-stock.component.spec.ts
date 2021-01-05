import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HyopOfStockComponent } from './hyop-of-stock.component';

describe('HyopOfStockComponent', () => {
  let component: HyopOfStockComponent;
  let fixture: ComponentFixture<HyopOfStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyopOfStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyopOfStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
