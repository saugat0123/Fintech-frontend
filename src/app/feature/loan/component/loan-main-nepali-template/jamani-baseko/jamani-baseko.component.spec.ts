import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JamaniBasekoComponent } from './jamani-baseko.component';

describe('JamaniBasekoComponent', () => {
  let component: JamaniBasekoComponent;
  let fixture: ComponentFixture<JamaniBasekoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JamaniBasekoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamaniBasekoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
