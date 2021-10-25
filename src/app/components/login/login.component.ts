import { Component, OnInit } from '@angular/core';
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { UserService } from '../../services/UserService';
import { MoneyService } from '../../services/MoneyService';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger("loginExplanation", [
      transition(':enter', [
        style({transform: 'translateX(-200%)'}),
        animate('0.5s')
      ]),
      transition(':leave', [
        animate('0.5s', style({transform: 'translateX(-200%)'}))
      ])
    ]),
    trigger("signupExplanation", [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('0.5s'),
        style({transform: 'width: 200%', transitionDuration: '1s'})
      ]),
      transition(':leave', [
        animate('0.5s', style({transform: 'translateX(200%)'}))
      ]),
    ]),
    trigger("signupForm", [
      transition(':enter', [
        style({transform: 'translateX(200%)', width: '0%', opacity: 0}),
        animate('1s'),
      ]),
      transition(':leave', [
        animate('0.5s', style({transform: 'translateY(-200%)'}))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  public userLoginDetails: UserLoginDetails;
  private userService: UserService;
  private moneyService: MoneyService;
  public state = "disabled";
  public secondaryState = "login";
  public loginAnimationSubscriber: any;

  constructor(userService: UserService, moneyService: MoneyService, private router: Router) { 
    this.userLoginDetails = new UserLoginDetails();
    this.userService = userService;
    this.moneyService = moneyService;
  }

  login() {

    if (!this.userLoginDetails.username || this.userLoginDetails.username && this.userLoginDetails.username != "" && (this.userLoginDetails.username.length < 4 || this.userLoginDetails.username.length > 12)) {

      alert ("Your username must be between 4 to 12 characters.");

    }

    else if (!this.userLoginDetails.password || this.userLoginDetails.password && this.userLoginDetails.password != "" && (this.userLoginDetails.password.length < 4 || this.userLoginDetails.password.length > 12)) {

      alert ("Your password must be between 4 to 12 characters.");

    }

    else {

      const observable = this.userService.login(this.userLoginDetails);

      observable.subscribe(successfulServerRequestData => {

        localStorage.setItem("token", successfulServerRequestData.token + "");
  
        let currency = {

          dollar: successfulServerRequestData.dollar!,
          shekel: successfulServerRequestData.shekel!,
          euro: successfulServerRequestData.euro!,
          yen: successfulServerRequestData.yen!,
          pound: successfulServerRequestData.pound!

        }

        this.router.navigate(["/account"]);

      this.userService.updateUsername(successfulServerRequestData.username!);
      this.moneyService.updateFunds(currency);

      }, serverErrorResponse => {
  
        alert ("Failed to login, the username or password you have entered may be incorrect, please try again.");
  
      });

    }

  }

  signup() {

    if (!this.userLoginDetails.username || this.userLoginDetails.username && this.userLoginDetails.username != "" && (this.userLoginDetails.username.length < 4 || this.userLoginDetails.username.length > 12)) {

      alert ("Your username must be between 4 to 12 characters.");

    }

    else if (!this.userLoginDetails.password || this.userLoginDetails.password && this.userLoginDetails.password != "" && (this.userLoginDetails.password.length < 4 || this.userLoginDetails.password.length > 12)) {

      alert ("Your password must be between 4 to 12 characters.");

    }

    else {

      const observable = this.userService.signUp(this.userLoginDetails);

      observable.subscribe(succesfulServerRequestData => {
  
        alert("Registered successfully!");
        this.secondaryState = "login";

        setTimeout(() => {
    
          this.state = "login";
    
        }, 600);
    
  
      }, serverErrorResponse => { 
        alert ("Registration failed. Please try again with different username/password.");
      });

    }

  }

  enterSignup() {

    this.state = "signup";
    this.userLoginDetails.username = "";
    this.userLoginDetails.password = "";

    setTimeout(() => {

      this.state = "signupForm";
      this.secondaryState = "signup";

    }, 600);

  }

  enterLogin() {

    this.secondaryState = "login";
    this.userLoginDetails.username = "";
    this.userLoginDetails.password = "";

    setTimeout(() => {

      this.state = "login";

    }, 600);

  }

  ngOnInit(): void {

    this.userService.currentlyLoggedIn();

    this.loginAnimationSubscriber = this.userService.loginAnimationObservable.subscribe((state) => {

      if (state == "enabled") {

        this.state = "login";

      }

      else if (state == "disabled") {

        this.router.navigate(["/account"]);

      }

    })

  }

  ngOnDestroy(): void {

    // this.userService.updateLoginAnimation("disabled");

    if (this.loginAnimationSubscriber) {

      this.loginAnimationSubscriber.unsubscribe();

    }

  }

}
