import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoViewButtonComponent } from './memo-view-button.component';

describe('MemoViewButtonComponent', () => {
  let component: MemoViewButtonComponent;
  let fixture: ComponentFixture<MemoViewButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoViewButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoViewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
