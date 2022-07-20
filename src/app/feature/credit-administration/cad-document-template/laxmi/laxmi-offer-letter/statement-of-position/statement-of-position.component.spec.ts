import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfPositionComponent } from './statement-of-position.component';

describe('StatementOfPositionComponent', () => {
  let component: StatementOfPositionComponent;
  let fixture: ComponentFixture<StatementOfPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementOfPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementOfPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
