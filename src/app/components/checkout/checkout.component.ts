import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2shopValidators } from 'src/app/validators/luv2shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalQuantity: number = 0;
  totalPrice: number = 0.0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey);
  cardElement: any;
  displayError: any = "";
  paymentInfo: PaymentInfo = new PaymentInfo();

  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder, private cartService: CartService,
    private luv2ShopFormService: Luv2ShopFormService, private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    // setup stripe payment form
    this.setUpStripePaymentform();

    const theEmail = JSON.parse(sessionStorage.getItem('email'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpaces]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpaces]),
        email: new FormControl(theEmail , [Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
      }),
      creditCard: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpaces]),
        // cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        // securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        // expirationMonth: [''],
        // expirationYear: ['']
      })
    });

    // populate totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // populate totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // this.cartService.computeCartTotals();

    // populate credit card months
    // let currMonth = new Date().getMonth() + 1;

    // this.luv2ShopFormService.getCreditCardMonths(currMonth).subscribe(
    //   data => {
    //     // console.log("Retrieved credit card months: " + JSON, stringify(data));
    //     this.creditCardMonths = data;
    //   }
    // );

    // // populate credit card years
    // this.luv2ShopFormService.getCreditCardYears().subscribe(
    //   data => {
    //     // console.log("Retrieved credit card years: " + JSON, stringify(data));
    //     this.creditCardYears = data;
    //   }
    // );

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        // console.log("Retrieved countries: " + JSON, stringify(data));
        this.countries = data;
      }
    );

  }
  setUpStripePaymentform() {
    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // create a card element
    this.cardElement = elements.create('card', {hidePostalCode : true});

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount("#card-element");

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event) => {
      this.displayError = document.getElementById('card-errors');

      if(event.complete) {
        this.displayError.textContent = "";
      } else if(event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  // getters for customer fields
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  // getters for shipping Address fields
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  // getters for billing Address fields
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  // getters for credit card
  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = [];
    // for (let tempCartItem of cartItems) {
    //   orderItems.push(new OrderItem(tempCartItem));
    // }

    orderItems = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    console.log(JSON.stringify(purchase.shippingAddress.state));
    console.log(JSON.stringify(purchase.shippingAddress.country));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "INR";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log(`The passed amount from frontend is: ${this.paymentInfo.amount}`);

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    country: this.billingAddressCountry.value.code
                  }
                }
              }
            }, { handleActions: false })
          .then(function(result) {
            if (result.error) {
              // inform the customer there was an error
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled = false;
            } else {
              // call REST API via the CheckoutService
              this.checkoutService.placeOrder(purchase).subscribe({
                next: response => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                  // reset cart
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: err => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              })
            }            
          }.bind(this));
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }
  resetCart() {
    // reset your cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.computeCartTotals();

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the home page
    this.router.navigateByUrl("/products");
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear = new Date().getUTCFullYear();

    const startYear: number = Number(creditCardGroup.value.expirationYear);
    // const startYear = creditCardGroup.get('expirationYear').value;

    let startMonth: number;

    if (currentYear === startYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // console.log("Retrieved credit card months: " + JSON, stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  getStates(theFormGroup: string) {
    const formGroup = this.checkoutFormGroup.get(theFormGroup);
    const countryCode = formGroup.value.country.code;

    console.log(`${theFormGroup}'s country code is: ${countryCode}`);
    console.log(`${theFormGroup}'s country is: ${formGroup.value.country.name}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(

      data => {

        if (theFormGroup === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);
      });
  }
}
