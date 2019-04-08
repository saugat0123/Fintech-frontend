import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoTypeComponent } from './memo-type.component';

describe('MemoTypeComponent', () => {
  let component: MemoTypeComponent;
  let fixture: ComponentFixture<MemoTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
