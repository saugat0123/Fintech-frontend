import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MicroChecklistComponent} from './micro-checklist.component';

describe('MicroChecklistComponent', () => {
  let component: MicroChecklistComponent;
  let fixture: ComponentFixture<MicroChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
