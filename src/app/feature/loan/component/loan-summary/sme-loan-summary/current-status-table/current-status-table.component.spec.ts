import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStatusTableComponent } from './current-status-table.component';

describe('CurrentStatusTableComponent', () => {
  let component: CurrentStatusTableComponent;
  let fixture: ComponentFixture<CurrentStatusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentStatusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
