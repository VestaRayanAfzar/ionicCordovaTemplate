import {IFormController, IRootScopeService} from 'angular';
import {IValidationErrors} from "../cmn/Validator";

export class FormService {
    static $inject = [];

    constructor() {
    }

    public evaluate(validationErrors: IValidationErrors, form: IFormController): boolean {
        form.$setPristine();
        if (validationErrors == null) return true;
        for (var fieldName in validationErrors) {
            if (validationErrors.hasOwnProperty(fieldName)) {
                form[fieldName].$setValidity(validationErrors[fieldName].rule, false);
                form[fieldName].$setDirty();
            }
        }
        return false;
    }

}
