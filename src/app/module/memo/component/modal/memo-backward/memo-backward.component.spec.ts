import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoBackwardComponent } from './memo-backward.component';

describe('MemoBackwardComponent', () => {
  let component: MemoBackwardComponent;
  let fixture: ComponentFixture<MemoBackwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoBackwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoBackwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
