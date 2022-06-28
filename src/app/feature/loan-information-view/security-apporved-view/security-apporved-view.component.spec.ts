import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityApporvedViewComponent } from './security-apporved-view.component';

describe('SecurityApporvedViewComponent', () => {
  let component: SecurityApporvedViewComponent;
  let fixture: ComponentFixture<SecurityApporvedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityApporvedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityApporvedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
