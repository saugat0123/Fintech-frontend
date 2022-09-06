import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DslWholesaleComponent } from './dsl-wholesale.component';

describe('DslWholesaleComponent', () => {
  let component: DslWholesaleComponent;
  let fixture: ComponentFixture<DslWholesaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DslWholesaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DslWholesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
