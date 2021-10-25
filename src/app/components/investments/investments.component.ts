import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UserService';
import { MoneyService } from '../../services/MoneyService';
import { InvestmentService } from '../../services/InvestmentsService';
import { Investment } from '../../models/Investment';
import { ActiveInvestment } from '../../models/ActiveInvestment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements OnInit {

  private userService: UserService;
  private moneyService: MoneyService;
  private investmentService: InvestmentService;

  public investmentsObservable: any;

  public investments: Investment[] = [];

  public activeInvestments: ActiveInvestment[] = [];

  public currency: any = {

    dollar: 0,
    shekel: 0,
    euro: 0,
    yen: 0,
    pound: 0

  };
  public fundsObservable: any;

  public currentTime: any;

  public intervalPointer: any;

  public userLoggedInObservable: any;

  constructor(userService: UserService, moneyService: MoneyService, investmentService: InvestmentService, private router: Router) {
    this.userService = userService;
    this.moneyService = moneyService;
    this.investmentService = investmentService;
  }

  invest(index: number) {

    if (this.investments[index].required_sum! > this.currency[this.investments[index].required_type!]) {

      alert ("Cannot proceed in the transaction since you lack enough money of said required currency. Please try again once you have enough of it.");

    }

    else {

      const observable = this.investmentService.newInvestment(this.investments[index]);

      observable.subscribe(successfulServerRequestData => {
  
        this.currency[successfulServerRequestData.currency_type!] = this.currency[successfulServerRequestData.currency_type!] - successfulServerRequestData.amount_gained!;

        this.moneyService.updateFunds(this.currency);

        successfulServerRequestData.amount_gained = Math.ceil(successfulServerRequestData.amount_gained! * (this.investments[index].potential_growth_percentage! + 100) / 100);

        let required_time = new Date();

        required_time.setTime(successfulServerRequestData.time_remaining!);

        this.setCurrentTime();

        successfulServerRequestData.minutes_seconds_remaining = [Math.floor((required_time.getTime() - this.currentTime)/60), (required_time.getTime() - this.currentTime) % 60];

        this.activeInvestments.push(successfulServerRequestData);

        this.startCountdown();

      }, serverErrorResponse => {

        alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
        this.router.navigate(["/login"]);
        this.userService.updateLoginAnimation("enabled");
        localStorage.removeItem("token");

      });

    }

  }

  completeInvestment(index: number) {

    const observable = this.investmentService.completeInvestment({investment_id: this.activeInvestments[index].investment_id, index: index});

    observable.subscribe(successfulServerRequestData => {

      this.currency[this.activeInvestments[index].currency_type!] = this.currency[this.activeInvestments[index].currency_type!] + this.activeInvestments[index].amount_gained;

      this.moneyService.updateFunds(this.currency);

      this.activeInvestments.splice(index, 1);

    }, serverErrorResponse => {

      alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
      this.router.navigate(["/login"]);
      this.userService.updateLoginAnimation("enabled");
      localStorage.removeItem("token");

    });

  }

  startCountdown() {

    if (this.intervalPointer) {

      clearInterval(this.intervalPointer);
      this.intervalPointer = undefined;

    }

    this.intervalPointer = setInterval(() => {

      for (let i = 0; i < this.activeInvestments.length; i++) {

        if (this.activeInvestments[i].minutes_seconds_remaining[0] >= 0 && this.activeInvestments[i].minutes_seconds_remaining[1] > 0) {

          this.activeInvestments[i].minutes_seconds_remaining[1] = this.activeInvestments[i].minutes_seconds_remaining[1] - 1; 

        }

        else if (this.activeInvestments[i].minutes_seconds_remaining[0] > 0 && this.activeInvestments[i].minutes_seconds_remaining[1] == 0) {

          this.activeInvestments[i].minutes_seconds_remaining[0] = this.activeInvestments[i].minutes_seconds_remaining[0] - 1;
          this.activeInvestments[i].minutes_seconds_remaining[1] = 59;

        }

        else if (this.activeInvestments[i].minutes_seconds_remaining[0] == 0 && this.activeInvestments[i].minutes_seconds_remaining[1] == 0) {

          this.activeInvestments[i].minutes_seconds_remaining[0] = -1;

        }

      }

    }, 1000);

  }

  setCurrentTime() {

    this.currentTime = Math.floor(new Date().getTime() / 1000);

  }

  calculateTimeRemaining() {

    this.setCurrentTime();

    for (let i = 0; i < this.activeInvestments.length; i++) {

      let required_time = new Date();

      required_time.setTime(this.activeInvestments[i].time_remaining!);

      this.activeInvestments[i].minutes_seconds_remaining = [Math.floor((required_time.getTime() - this.currentTime)/60), (required_time.getTime() - this.currentTime) % 60];

    }

    this.startCountdown();

  }

  ngOnInit(): void {
    
    this.userService.currentlyLoggedIn();

    this.userLoggedInObservable = this.userService.loginAnimationObservable.subscribe((state) => {

      if (state == "disabled") {

        this.fundsObservable = this.moneyService.fundsObservable.subscribe((currency) => {
      
          this.currency = currency;
    
        });
    
        this.investmentsObservable = this.investmentService.investmentsObservable.subscribe((investments) => {

          if (investments.length == 0) {
    
            let observable = this.investmentService.getAllInvestments();
    
            observable.subscribe(successfulServerRequestData => {
    
              for (let i = 0; i < successfulServerRequestData[1].length; i++) {
    
                  for (let j = 0; j < successfulServerRequestData[0].length; j++) {
    
                    if (successfulServerRequestData[1][i].investment_name == successfulServerRequestData[0][j].investment_name) {
    
                      successfulServerRequestData[1][i].amount_gained = Math.ceil(successfulServerRequestData[1][i].amount_gained * (successfulServerRequestData[0][j].potential_growth_percentage! + 100) / 100);
    
                      break;
    
                    }
      
                  }
    
              }
    
              this.investmentService.updateInvestments(successfulServerRequestData[0]);
    
              this.activeInvestments = successfulServerRequestData[1];
    
              this.calculateTimeRemaining();
    
              this.investmentService.activeInvestments = successfulServerRequestData[1];
    
            }, serverErrorResponse => {

              alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
              this.router.navigate(["/login"]);
              this.userService.updateLoginAnimation("enabled");
              localStorage.removeItem("token");
        
            });
    
          }
    
          else {
    
            if (this.investments != investments) {
    
              this.investments = investments;
    
              if (this.activeInvestments != this.investmentService.activeInvestments) {
                
                this.activeInvestments = this.investmentService.activeInvestments;
    
                this.calculateTimeRemaining();
    
              }
    
            }
    
          }
    
        });

      }

      else if (state == "enabled") {

        this.router.navigate(["/login"]);

      }

    });

  }

  ngOnDestroy(): void {

    if (this.investmentsObservable) {

      this.investmentsObservable.unsubscribe();

    }

    if (this.fundsObservable) {

      this.fundsObservable.unsubscribe();

    }

    if (this.intervalPointer) {

      clearInterval(this.intervalPointer);
      this.intervalPointer = undefined;

    }

    if (this.userLoggedInObservable) {

      this.userLoggedInObservable.unsubscribe();

    }

  }

}
