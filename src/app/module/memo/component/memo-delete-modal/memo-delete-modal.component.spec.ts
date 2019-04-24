import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoDeleteModalComponent } from './memo-delete-modal.component';

describe('MemoDeleteModalComponent', () => {
  let component: MemoDeleteModalComponent;
  let fixture: ComponentFixture<MemoDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
