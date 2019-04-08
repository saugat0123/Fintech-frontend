import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoInboxComponent } from './memo-inbox.component';

describe('MemoInboxComponent', () => {
  let component: MemoInboxComponent;
  let fixture: ComponentFixture<MemoInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
