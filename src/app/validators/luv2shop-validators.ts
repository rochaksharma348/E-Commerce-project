import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2shopValidators {

    public static notOnlyWhiteSpaces(control: FormControl): ValidationErrors {
        if((control.value != null) && (control.value.trim().length === 0)) {
            return {'notOnlyWhiteSpaces': true};
        } else {
            return null;
        }
    }
}
