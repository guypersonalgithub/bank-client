import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/UserService';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger("manageMenu", [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('0.3s')
      ]),
      transition(':leave', [
        animate('0.3s', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger("menuShader", [
      transition(':enter', [
        style({opacity: 0}),
        animate('0.3s')
      ]),
      transition(':leave', [
        animate('0.3s', style({opacity: 0}))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {

  public userService: UserService;
  public loggedUser = false;
  public openMenu = false;
  public userServiceSub: any;

  constructor(userService: UserService, private router: Router) { 
    this.userService = userService;
  }

  home() {

    this.router.navigate(["/"]);

  }

  menuHome() {

    this.home();
    this.close();

  }

  account() {

    this.router.navigate(["/account"]);

  }

  menuAccount() {

    this.account();
    this.close();

  }

  investments() {

    this.router.navigate(["/investments"]);

  }

  menuInvestments() {

    this.investments();
    this.close();

  }

  coinrates() {

    this.router.navigate(["/coinrates"]);

  }

  menuCoinrates() {

    this.coinrates();
    this.close();

  }

  about() {

    this.router.navigate(["/about"]);

  }

  menuAbout() {

    this.about();
    this.close();

  }

  startHere() {

    if (this.loggedUser) {

      this.router.navigate(["/account"]);

    }

    else {

      this.router.navigate(["/login"]);

    }

  }

  open() {

    this.openMenu = true;

  }

  close() {

    this.openMenu = false;

  }

  ngOnInit(): void {

    this.userServiceSub = this.userService.userNameObservable.subscribe((username) => {

      if (username != "") {

        this.loggedUser = true;

      }

      else {

        this.loggedUser = false;

      }

    });

  }

  ngOnDestroy(): void {

    if (this.userServiceSub) {

      this.userServiceSub.unsubscribe();

    }

  }

}
