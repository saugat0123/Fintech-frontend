import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothecationOfStockSecurityComponent } from './hypothecation-of-stock-security.component';

describe('HypothecationOfStockSecurityComponent', () => {
  let component: HypothecationOfStockSecurityComponent;
  let fixture: ComponentFixture<HypothecationOfStockSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothecationOfStockSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothecationOfStockSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
