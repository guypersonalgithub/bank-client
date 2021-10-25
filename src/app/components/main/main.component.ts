import { Component, OnInit } from '@angular/core';
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { UserService } from '../../services/UserService';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger("flyInOut", [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('0.5s')
      ]),
      transition(':leave', [
        animate('0.5s', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})

// trigger("flyInOut", [
//   transition(':enter', [
//     style ({ transform: 'translateX(-100%)' }),
//     animate('200ms ease-in', style({transform: 'translateX(0%)'}))
//   ]),
//   transition(':leave', [
//     animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
//   ])
// ])
export class MainComponent implements OnInit {

  public userLoginDetails: UserLoginDetails;
  private usersService: UserService;
  public miniMenu = ["miniMenuOptionPicked", "miniMenuOption", "miniMenuOption", "miniMenuOption", "miniMenuOption"];
  public miniMenuIcons = ["miniMenuIconPicked", "miniMenuIcon", "miniMenuIcon", "miniMenuIcon", "miniMenuIcon"];
  public miniMenuText = ["miniMenuTextPicked", "miniMenuText", "miniMenuText", "miniMenuText", "miniMenuText"];
  public currentClickedPart = 0;
  public disableAnimationsOnPageLoad = true;

  constructor(usersService: UserService, private router: Router ) { 
    this.userLoginDetails = new UserLoginDetails();
    this.usersService = usersService;
  }

  public signUp(): void {

    this.router.navigate(["/signup"]);

  }

  public pickPart(index: number): void {

    if (this.disableAnimationsOnPageLoad) {

      this.disableAnimationsOnPageLoad = false;

    }

    this.miniMenu[this.currentClickedPart] = "miniMenuOption";
    this.miniMenuIcons[this.currentClickedPart] = "miniMenuIcon";
    this.miniMenuText[this.currentClickedPart] = "miniMenuText";

    this.miniMenu[index] = "miniMenuOptionPicked";
    this.miniMenuIcons[index] = "miniMenuIconPicked";
    this.miniMenuText[index] = "miniMenuTextPicked";
  
    this.currentClickedPart = index;

  }

  openLink(url: string) {

    window.open(url, "_blank");

  }
  ngOnInit(): void {

  }

}
