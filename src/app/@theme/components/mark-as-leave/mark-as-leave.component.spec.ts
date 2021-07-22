import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAsLeaveComponent } from './mark-as-leave.component';

describe('MarkAsLeaveComponent', () => {
  let component: MarkAsLeaveComponent;
  let fixture: ComponentFixture<MarkAsLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAsLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAsLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
