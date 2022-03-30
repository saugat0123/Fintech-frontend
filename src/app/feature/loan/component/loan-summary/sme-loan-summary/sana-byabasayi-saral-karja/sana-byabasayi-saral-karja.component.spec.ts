import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaByabasayiSaralKarjaComponent } from './sana-byabasayi-saral-karja.component';

describe('SanaByabasayiSaralKarjaComponent', () => {
  let component: SanaByabasayiSaralKarjaComponent;
  let fixture: ComponentFixture<SanaByabasayiSaralKarjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaByabasayiSaralKarjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaByabasayiSaralKarjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
