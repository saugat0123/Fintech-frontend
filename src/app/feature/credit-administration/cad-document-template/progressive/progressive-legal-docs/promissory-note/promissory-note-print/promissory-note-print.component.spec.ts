import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PromissoryNotePrintComponent} from './promissory-note-print.component';

describe('PromissoryNotePrintComponent', () => {
  let component: PromissoryNotePrintComponent;
  let fixture: ComponentFixture<PromissoryNotePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromissoryNotePrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
