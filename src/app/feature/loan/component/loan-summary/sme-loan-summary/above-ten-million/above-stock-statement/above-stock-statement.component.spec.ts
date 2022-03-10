import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveStockStatementComponent } from './above-stock-statement.component';

describe('AboveStockStatementComponent', () => {
  let component: AboveStockStatementComponent;
  let fixture: ComponentFixture<AboveStockStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveStockStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveStockStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
