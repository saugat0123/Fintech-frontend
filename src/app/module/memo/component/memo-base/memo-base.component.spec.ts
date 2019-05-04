import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoBaseComponent } from './memo-base.component';

describe('MemoBaseComponent', () => {
  let component: MemoBaseComponent;
  let fixture: ComponentFixture<MemoBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
