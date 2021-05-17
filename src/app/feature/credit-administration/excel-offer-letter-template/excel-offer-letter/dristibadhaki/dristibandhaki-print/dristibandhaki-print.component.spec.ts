import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DristibandhakiPrintComponent } from './dristibandhaki-print.component';

describe('DristibandhakiPrintComponent', () => {
  let component: DristibandhakiPrintComponent;
  let fixture: ComponentFixture<DristibandhakiPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DristibandhakiPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DristibandhakiPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
