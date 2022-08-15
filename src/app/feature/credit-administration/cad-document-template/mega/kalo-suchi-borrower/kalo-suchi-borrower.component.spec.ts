import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaloSuchiBorrowerComponent } from './kalo-suchi-borrower.component';

describe('KaloSuchiBorrowerComponent', () => {
  let component: KaloSuchiBorrowerComponent;
  let fixture: ComponentFixture<KaloSuchiBorrowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaloSuchiBorrowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaloSuchiBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
