import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DhristiBandhakPrintComponent } from './dhristi-bandhak-print.component';

describe('DhristiBandhakPrintComponent', () => {
  let component: DhristiBandhakPrintComponent;
  let fixture: ComponentFixture<DhristiBandhakPrintComponent>;

  beforeEach(waitForAsync(() => {
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
