import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSecurityTableComponent } from './view-security-table.component';

describe('ViewSecurityTableComponent', () => {
  let component: ViewSecurityTableComponent;
  let fixture: ComponentFixture<ViewSecurityTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSecurityTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSecurityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
