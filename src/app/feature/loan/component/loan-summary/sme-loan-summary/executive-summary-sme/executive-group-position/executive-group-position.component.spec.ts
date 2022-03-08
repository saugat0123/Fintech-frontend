import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveGroupPositionComponent } from './executive-group-position.component';

describe('ExecutiveGroupPositionComponent', () => {
  let component: ExecutiveGroupPositionComponent;
  let fixture: ComponentFixture<ExecutiveGroupPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveGroupPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveGroupPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
