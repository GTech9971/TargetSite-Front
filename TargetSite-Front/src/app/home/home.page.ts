import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) { }


  async onClickTimeAttackCard() {
    await this.router.navigate(['time-atk']);
  }

  async onClickNormalCard() {
    await this.router.navigate(['normal']);
  }

}
