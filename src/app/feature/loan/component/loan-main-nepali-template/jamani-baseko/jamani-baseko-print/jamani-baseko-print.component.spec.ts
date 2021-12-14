import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JamaniBasekoPrintComponent } from './jamani-baseko-print.component';

describe('JamaniBasekoPrintComponent', () => {
  let component: JamaniBasekoPrintComponent;
  let fixture: ComponentFixture<JamaniBasekoPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JamaniBasekoPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamaniBasekoPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
