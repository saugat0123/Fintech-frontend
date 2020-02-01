import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DhristiBandhakPrintComponent } from './dhristi-bandhak-print.component';

describe('DhristiBandhakPrintComponent', () => {
  let component: DhristiBandhakPrintComponent;
  let fixture: ComponentFixture<DhristiBandhakPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DhristiBandhakPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DhristiBandhakPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
