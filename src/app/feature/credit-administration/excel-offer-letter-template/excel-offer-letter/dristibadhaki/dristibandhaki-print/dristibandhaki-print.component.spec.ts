import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DristibandhakiPrintComponent } from './dristibandhaki-print.component';

describe('DristibandhakiPrintComponent', () => {
  let component: DristibandhakiPrintComponent;
  let fixture: ComponentFixture<DristibandhakiPrintComponent>;

  beforeEach(waitForAsync(() => {
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
