import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteResponse } from 'src/app/common/delete-response';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import { Luv2shopValidators } from 'src/app/validators/luv2shop-validators';

@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.css']
})
export class DeleteOrderComponent implements OnInit {

  deleteFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private orderHistoryService: OrderHistoryService,
              private router: Router) { }

  ngOnInit(): void {
    this.deleteFormGroup = this.formBuilder.group({
      reason : new FormControl('', [Validators.required, Validators.minLength(5), Luv2shopValidators.notOnlyWhiteSpaces])
    });
  }

  get reason() { return this.deleteFormGroup.get('reason');}

  onSubmit() {

    if (this.deleteFormGroup.invalid) {
      this.deleteFormGroup.markAllAsTouched();
      return;
    }

    const deleteResponse = new DeleteResponse();

    deleteResponse.id = +this.route.snapshot.paramMap.get('id');
    deleteResponse.reason = this.deleteFormGroup.controls['reason'].value;

    this.orderHistoryService.deleteOrder(deleteResponse).subscribe({
      next: response => {
        alert('Your order has been deleted successfully!')
        this.router.navigate(['/order-history']);
      },
      error: err => {
        alert(`There has been an error: ${err.message}`)
      }
    }
    )
  }

}
