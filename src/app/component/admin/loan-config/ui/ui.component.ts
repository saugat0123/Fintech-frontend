import { Component, OnInit } from '@angular/core';

declare var $;
@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css']
})
export class UIComponent implements OnInit {

  favoriteName: string;
  name: string;
  a:  Array<String> = new Array();
  names = ['Document 1', 'Document 2', 'Document 3', 'Document 4'];
  constructor() {

  }

  ngOnInit() {

  }
  checkCheckBoxvalue(event) {
    console.log(event.checked);
    let checkValue = $('.itemCheck:checked').val();
    /*console.log(checkValue);*/
    if (event.checked === true) {
      this.a.push(checkValue);
    }

  }
  send(){
   /* let checkValue = $('.itemCheck:checked').val();*/
    /*console.log(this.a);*/
        let favorite = [];
        $.each($('.itemCheck:checked'), function() {
          favorite.push($(this).val());
        });
        alert('Document selected are: ' + favorite.join(', '));
    console.log(this.a);
  }
  toggle(event) {
    console.log(event);
  }
}
