import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoConvenantsComponent } from './upto-convenants.component';

describe('UptoConvenantsComponent', () => {
  let component: UptoConvenantsComponent;
  let fixture: ComponentFixture<UptoConvenantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoConvenantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoConvenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
