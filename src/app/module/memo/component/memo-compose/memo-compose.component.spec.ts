import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoComposeComponent } from './memo-compose.component';

describe('MemoComposeComponent', () => {
  let component: MemoComposeComponent;
  let fixture: ComponentFixture<MemoComposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoComposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
