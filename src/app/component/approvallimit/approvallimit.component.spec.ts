import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovallimitComponent } from './approvallimit.component';

describe('ApprovallimitComponent', () => {
  let component: ApprovallimitComponent;
  let fixture: ComponentFixture<ApprovallimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovallimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovallimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
