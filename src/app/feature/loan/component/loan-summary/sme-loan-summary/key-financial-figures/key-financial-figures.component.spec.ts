import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyFinancialFiguresComponent } from './key-financial-figures.component';

describe('KeyFinancialFiguresComponent', () => {
  let component: KeyFinancialFiguresComponent;
  let fixture: ComponentFixture<KeyFinancialFiguresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyFinancialFiguresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyFinancialFiguresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
