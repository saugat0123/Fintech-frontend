import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmePrintComponent } from './sme-print.component';

describe('SmePrintComponent', () => {
  let component: SmePrintComponent;
  let fixture: ComponentFixture<SmePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
