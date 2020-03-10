import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationMasterComponent } from './notification-master.component';

describe('NotificationMasterComponent', () => {
  let component: NotificationMasterComponent;
  let fixture: ComponentFixture<NotificationMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
