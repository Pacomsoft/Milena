$(function() {
  'use strict';

  $.validator.setDefaults({
    submitHandler: function() {
      alert("submitted!");
    }
  });
  $(function() {
    // validate signup form on keyup and submit
    $("#signupForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 3
        },
        newpassword: {
          required: true,
          minlength: 5
        },
        birthday:{
          required:true,
          date: true
        },
        confirm_password: {
          required: true,
          minlength: 5,
          equalTo: "#newpassword"
        },
        email: {
          required: true,
          email: true
        },
        topic: {
          required: "#newsletter:checked",
          minlength: 2
        },
        answer:{
          required: true,
          maxlength:50
        },
        question:{
          required:true        
        },
        agree: "required"
      },
      messages: {
        name: {
          required: "Ingresa el nombre de usuario",
          minlength: "El nombre de usuario debe tener al menos 3 caracteres"
        },
        newpassword: {
          required: "Por favor ingresa una contraseña",
          minlength: "Tu contraseña debe tener al menos 5 caracteres"
        },
        confirm_password: {
          required: "Por favor, confirma la contraseña",
          minlength: "Tu contraseña debe tener al menos 5 caracteres",
          equalTo: "Por favor, ingresa la misma contraseña"
        },
        email: "Por favor ingresa un correo elctrónico válido",
        answer: {
            required: "Ingresa una respuesta a tu pregunta de seguridad, esta te servirá para reestablecer tu contraseña",
            maxlength: 50,
            minlength: 5
        },
        question: "Selecciona una pregunta de seguridad. Esta te servirá para reestablecer tu contraseña",
        birthday: "Ingresa tu fecha de nacimiento"
      },
      errorPlacement: function(label, element) {
        label.addClass('mt-2 text-danger');
        label.insertAfter(element);
      },
      highlight: function(element, errorClass) {
        $(element).parent().addClass('has-danger')
        $(element).addClass('form-control-danger')
      }
    });
  });
});