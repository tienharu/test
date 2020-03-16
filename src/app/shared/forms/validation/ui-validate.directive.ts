import { Directive, Input, ElementRef } from "@angular/core";

@Directive({
  selector: "[saUiValidate]"
})
export class UiValidateDirective {
  @Input() saUiValidate: any;

  constructor(private el: ElementRef) {
    Promise.all([
      import("jquery-validation/dist/jquery.validate.js"),
      import("jquery-validation/dist/additional-methods.js")
    ])
      .then(() => {
        this.attach();
      });
  }

  attach() {
    $.validator.addMethod("greaterThanOrEqual",
      function (value, element, params) {
        var fromDate = $(`input[name=${params}]`).val();
        if (!Date.parse(fromDate)) {
          fromDate = 1;
        }
        return this.optional(element) || Date.parse(fromDate) <= Date.parse(value);
      },"To date must greater than or equal From date !");
    const $form = $(this.el.nativeElement);
    const validateCommonOptions = {
      rules: {},
      messages: {},
      errorElement: "em",
      errorClass: "invalid",
      highlight: (element, errorClass, validClass) => {
        $(element)
          .addClass(errorClass)
          .removeClass(validClass);
        $(element)
          .parent()
          .addClass("state-error")
          .removeClass("state-success");
      },
      unhighlight: (element, errorClass, validClass) => {
        $(element)
          .removeClass(errorClass)
          .addClass(validClass);
        $(element)
          .parent()
          .removeClass("state-error")
          .addClass("state-success");
      },

      errorPlacement: (error, element) => {
        var elem = $(element);
        if (elem.hasClass("select2-hidden-accessible")) {
          error.insertAfter(element.next('span.select2'));
        }
        else if (element.parent('.input-group').length) {
          error.insertAfter(element.parent());
        } else {
          error.insertAfter(element);
        }
      }
    };

    $form
      .find("[data-smart-validate-input], [smart-validate-input]")
      .each(function () {
        var $input = $(this),
          fieldName = $input.attr("name");

        validateCommonOptions.rules[fieldName] = {};

        if ($input.data("required") != undefined) {
          validateCommonOptions.rules[fieldName].required = true;
        }
        if ($input.data("email") != undefined) {
          validateCommonOptions.rules[fieldName].email = true;
        }

        if ($input.data("maxlength") != undefined) {
          validateCommonOptions.rules[fieldName].maxlength = $input.data(
            "maxlength"
          );
        }

        if ($input.data("minlength") != undefined) {
          validateCommonOptions.rules[fieldName].minlength = $input.data(
            "minlength"
          );
        }

        if ($input.data("greaterThan") != undefined) {
          validateCommonOptions.rules[fieldName].greaterThan = $input.data(
            "greaterThan"
          );
        }

        if ($input.data("message")) {
          validateCommonOptions.messages[fieldName] = $input.data("message");
        } else {
          Object.keys($input.data()).forEach(key => {
            if (key.search(/message/) == 0) {
              if (!validateCommonOptions.messages[fieldName])
                validateCommonOptions.messages[fieldName] = {};

              var messageKey = key.toLowerCase().replace(/^message/, "");
              validateCommonOptions.messages[fieldName][
                messageKey
              ] = $input.data(key);
            }
          });
        }
      });

    $form.validate($.extend(validateCommonOptions, this.saUiValidate));
  }
}
