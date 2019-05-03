import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoReadComponent } from './memo-read.component';

describe('MemoReadComponent', () => {
  let component: MemoReadComponent;
  let fixture: ComponentFixture<MemoReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
