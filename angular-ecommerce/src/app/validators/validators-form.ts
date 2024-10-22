import { FormControl, ValidationErrors } from "@angular/forms";

export class ValidatorsForm {
    static notOnlyWhitespace(control:FormControl):ValidationErrors | null{
        if((control.value!=null) && (control.value.trim().length===0)){
            //invalid return error object
            return {'notOnlyWhiteSpace':true};
        }else{
            //valid , return null
            return null;
        }
    }
}
