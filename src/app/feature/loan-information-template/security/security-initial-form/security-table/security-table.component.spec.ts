import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SecurityTableComponent } from './security-table.component';

describe('SecurityTableComponent', () => {
  let component: SecurityTableComponent;
  let fixture: ComponentFixture<SecurityTableComponent>;

  beforeEach(waitForAsync(() => {
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
