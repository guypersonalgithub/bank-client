import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UserService';
import { MoneyService } from '../../services/MoneyService';
import { Router } from '@angular/router';
import { ExchangeCurrency } from '../../models/ExchangeCurrency';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  private userService: UserService;
  private moneyService: MoneyService;

  public username: string = "";
  public currency: any = {

    dollar: 0,
    shekel: 0,
    euro: 0,
    yen: 0,
    pound: 0

  };

  public usernameObservable: any;
  public fundsObservable: any;
  
  public currentAmountOfFunds = 0;

  public options = ["Dollar", "Shekel", "Euro", "Yen", "Pound"];

  public currentCoin = "Dollar";
  
  // public currentCoinForExchange = "";
  // public currentCoinToExchangeTo = "";
  // public amountForExchange = "";
  public expectedAmountToReceive: any = 0;
  public exchangeCurrency: ExchangeCurrency;

  public userLoggedInObservable: any;

  constructor(userService: UserService, moneyService: MoneyService, private router: Router) {
    this.userService = userService;
    this.moneyService = moneyService;
    this.exchangeCurrency = new ExchangeCurrency();
  }

  pickCurrency(currency: string) {

    this.currentAmountOfFunds = 0;
    this.currentCoin = currency;

    if (currency == "Dollar") {

      this.currentAmountOfFunds = this.currency.dollar + 
      this.currency.shekel * this.moneyService.Shekel.Dollar +
      this.currency.euro * this.moneyService.Euro.Dollar +
      this.currency.yen * this.moneyService.Yen.Dollar +
      this.currency.pound * this.moneyService.Pound.Dollar;

    }

    else if (currency == "Shekel") {

      this.currentAmountOfFunds = this.currency.dollar * this.moneyService.Dollar.Shekel +
      this.currency.shekel +
      this.currency.euro * this.moneyService.Euro.Shekel +
      this.currency.yen * this.moneyService.Yen.Shekel +
      this.currency.pound * this.moneyService.Pound.Shekel;

    }

    else if (currency == "Euro") {

      this.currentAmountOfFunds = this.currency.dollar * this.moneyService.Dollar.Euro +
      this.currency.shekel * this.moneyService.Shekel.Euro +
      this.currency.euro +
      this.currency.yen * this.moneyService.Yen.Euro +
      this.currency.pound + this.moneyService.Pound.Euro;

    }

    else if (currency == "Yen") {

      this.currentAmountOfFunds = this.currency.dollar * this.moneyService.Dollar.Yen +
      this.currency.shekel * this.moneyService.Shekel.Yen +
      this.currency.euro * this.moneyService.Euro.Yen +
      this.currency.yen +
      this.currency.pound * this.moneyService.Pound.Yen;

    }

    else {

      this.currentAmountOfFunds = this.currency.dollar * this.moneyService.Dollar.Pound +
      this.currency.shekel * this.moneyService.Shekel.Pound +
      this.currency.euro * this.moneyService.Euro.Pound +
      this.currency.yen * this.moneyService.Yen.Pound +
      this.currency.pound;

    }

    this.currentAmountOfFunds = Math.ceil(this.currentAmountOfFunds);

  }

  pickCurrencyForExchange(currency: string) {

    this.exchangeCurrency.exchangeFromCurrency = currency;

    if (this.exchangeCurrency.exchangeToCurrency != null && this.exchangeCurrency.exchangeToCurrency != this.exchangeCurrency.exchangeFromCurrency && this.exchangeCurrency.exchangeAmount! > 0) {

      this.calculateExpectedExchange();

    }
    
    else {

      this.expectedAmountToReceive = null;

    }

  }

  pickCurrencyToExchangeTo(currency: string) {

    this.exchangeCurrency.exchangeToCurrency = currency;

    if (this.exchangeCurrency.exchangeFromCurrency != null && this.exchangeCurrency.exchangeFromCurrency != this.exchangeCurrency.exchangeToCurrency && this.exchangeCurrency.exchangeAmount! > 0) {

      this.calculateExpectedExchange();

    }

    else {

      this.expectedAmountToReceive = null;

    }

  }

  toRates() {

    this.router.navigate(["/coinrates"]);

  }

  confirmExchange() {

    if (this.exchangeCurrency.exchangeFromCurrency == "" || this.exchangeCurrency.exchangeToCurrency == "" || this.exchangeCurrency.exchangeFromCurrency == this.exchangeCurrency.exchangeToCurrency) {

      alert("You must pick different currencies for an exchange.");

    }

    else {

      if (this.exchangeCurrency.exchangeAmount! > 0) {

        let answer;
  
        if (this.exchangeCurrency.exchangeFromCurrency == "Dollar") {
  
          answer = this.checkIfThereAreSufficientFunds(this.currency.dollar);
  
        }
  
        else if (this.exchangeCurrency.exchangeFromCurrency == "Shekel") {
  
          answer = this.checkIfThereAreSufficientFunds(this.currency.shekel);
  
        }
  
        else if (this.exchangeCurrency.exchangeFromCurrency == "Euro") {
  
          answer = this.checkIfThereAreSufficientFunds(this.currency.euro);
  
        }
  
        else if (this.exchangeCurrency.exchangeFromCurrency == "Yen") {
  
          answer = this.checkIfThereAreSufficientFunds(this.currency.yen);
  
        }
  
        else {
  
          answer = this.checkIfThereAreSufficientFunds(this.currency.pound);
  
        }
  
        if (answer) {
  
          const observable = this.moneyService.exchangeCurrency(this.exchangeCurrency);

          observable.subscribe(successfulServerRequestData => {

            this.currency[this.exchangeCurrency.exchangeFromCurrency!.toLowerCase()] = this.currency[this.exchangeCurrency.exchangeFromCurrency!.toLowerCase()] - this.exchangeCurrency.exchangeAmount!;
            this.currency[this.exchangeCurrency.exchangeToCurrency!.toLowerCase()] = this.currency[this.exchangeCurrency.exchangeToCurrency!.toLowerCase()] + this.expectedAmountToReceive;

            this.exchangeCurrency.exchangeAmount = undefined;
            this.exchangeCurrency.exchangeFromCurrency = "";
            this.exchangeCurrency.exchangeToCurrency = "";

          }, serverErrorResponse => {
      
            alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
            this.router.navigate(["/login"]);
            this.userService.updateLoginAnimation("enabled");
            localStorage.removeItem("token");
      
          })
  
        }
  
        else {
  
          alert("Cannot exchange without sufficient funds. Please try again with different amounts or currencies");
  
        }
  
      }
  
      else {
  
        alert ("You may only enter numbers that are bigger than 0.")
  
      }

    }

  }

  checkIfThereAreSufficientFunds(amount: number) {

    if (amount >= this.exchangeCurrency.exchangeAmount!) {

      return true;

    }

    return false;

  }

  calculateExpectedExchange() {

    if (this.currency.hasOwnProperty(this.exchangeCurrency.exchangeFromCurrency!.toLowerCase()) && this.exchangeCurrency.exchangeAmount! > 0) {

      this.expectedAmountToReceive = Math.ceil(this.exchangeCurrency.exchangeAmount! * this.moneyService[this.exchangeCurrency.exchangeFromCurrency!][this.exchangeCurrency.exchangeToCurrency!]);
      
    }

    else {

      this.expectedAmountToReceive = null;

    }

  }

  ngOnInit(): void {

    this.userService.currentlyLoggedIn();

    this.userLoggedInObservable = this.userService.loginAnimationObservable.subscribe((state) => {

      if (state == "disabled") {

        if (this.usernameObservable) {

          this.usernameObservable.unsubscribe();

        }

        if (this.fundsObservable) {

          this.fundsObservable.unsubscribe();

        }

        this.usernameObservable = this.userService.userNameObservable.subscribe((username) => {

          this.username = username;
    
        });
    
        this.fundsObservable = this.moneyService.fundsObservable.subscribe((currency) => {
    
          this.currency = currency;
    
          this.currentAmountOfFunds = this.currency.dollar + 
          this.currency.shekel * this.moneyService.Shekel.Dollar +
          this.currency.euro * this.moneyService.Euro.Dollar +
          this.currency.yen * this.moneyService.Yen.Dollar +
          this.currency.pound * this.moneyService.Pound.Dollar;
    
          this.currentAmountOfFunds = Math.ceil(this.currentAmountOfFunds);
    
        });

      }

      else if (state == "enabled") {

        this.router.navigate(["/login"]);

      }

    })

  }

  ngOnDestroy(): void {

    if (this.usernameObservable) {

      this.usernameObservable.unsubscribe();

    }

    if (this.fundsObservable) {

      this.fundsObservable.unsubscribe();

    }

    if (this.userLoggedInObservable) {

      this.userLoggedInObservable.unsubscribe();

    }

  }

}

