import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineBreakAddComponent } from './line-break-add.component';

describe('LineBreakAddComponent', () => {
  let component: LineBreakAddComponent;
  let fixture: ComponentFixture<LineBreakAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineBreakAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineBreakAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
