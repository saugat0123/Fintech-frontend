import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnusuchiComponent } from './anusuchi.component';

describe('AnusuchiComponent', () => {
  let component: AnusuchiComponent;
  let fixture: ComponentFixture<AnusuchiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnusuchiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnusuchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
