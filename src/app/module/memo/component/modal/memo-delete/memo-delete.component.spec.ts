import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoDeleteComponent } from './memo-delete.component';

describe('MemoDeleteComponent', () => {
  let component: MemoDeleteComponent;
  let fixture: ComponentFixture<MemoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
