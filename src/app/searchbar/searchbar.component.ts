import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {

  value:string = ''
  constructor(private router: Router)
  {

  }
  onEnter(value:string)
  {
    this.value= value;
    this.router.navigate(['/modelViewer'],{queryParams:{query:this.value}});
  }
}
