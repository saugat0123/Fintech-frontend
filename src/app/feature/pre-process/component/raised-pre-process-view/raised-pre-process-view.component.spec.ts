import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisedPreProcessViewComponent } from './raised-pre-process-view.component';

describe('RaisedPreProcessViewComponent', () => {
  let component: RaisedPreProcessViewComponent;
  let fixture: ComponentFixture<RaisedPreProcessViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaisedPreProcessViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaisedPreProcessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
