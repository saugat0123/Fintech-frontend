import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadPullComponent } from './cad-pull.component';

describe('CadPullComponent', () => {
  let component: CadPullComponent;
  let fixture: ComponentFixture<CadPullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadPullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadPullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
