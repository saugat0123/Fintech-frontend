import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityTableComponent } from './security-table.component';

describe('SecurityTableComponent', () => {
  let component: SecurityTableComponent;
  let fixture: ComponentFixture<SecurityTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
