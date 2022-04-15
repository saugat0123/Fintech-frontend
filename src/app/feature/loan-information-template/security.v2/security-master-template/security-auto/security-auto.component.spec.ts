import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAutoComponent } from './security-auto.component';

describe('SecurityAutoComponent', () => {
  let component: SecurityAutoComponent;
  let fixture: ComponentFixture<SecurityAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityAutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
