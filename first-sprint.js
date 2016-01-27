
//routers
Router.configure({
    layoutTemplate: 'main'
});
Router.route('/RecoverPassword');
Router.route('/', {
    template: 'login'
});
Router.route('/register');
Router.route('/dashboard');

//client side
if (Meteor.isClient) {

  //message for login and registration
	Session.set("enemyLogIn", "");//login
	Session.set("enemyLogOut", "");//registration

    Template.register.events({
    'submit form': function(event) {//insert the user name to database
        event.preventDefault();
        var fnameVar = event.target.registerFirstName.value;
		var lnameVar = event.target.registerLastName.value;
		var emailVar = event.target.registerEmail.value;
		var passwordVar = event.target.registerPassword.value;
		var confirmVar = event.target.confirmPassword.value;
		var addressVar = event.target.registerAddress.value;
		var stateVar = event.target.registerState.value;
		var zipVar = event.target.registerZip.value;
		var telephoneVar = event.target.registerTelephone.value;
		
				
        Accounts.createUser({
            email: emailVar,
			fname: fnameVar,
			lname: lnameVar,
            password: passwordVar,
			confirm: confirmVar, 
			address: addressVar,
			state: stateVar, 
			zip: zipVar,
			telephone: telephoneVar 
        },
        function(err)//in case we have error, such as existing user
        {
          if(err)//present this message 
            Session.set("enemyLogOut", "Error, email is allready taken");
          else
           { //otherwise, change the message, we succed to store the user
            Session.set("enemyLogOut", "");
            Session.set("enemyLogIn", "");
          }
        });
    }
});
Template.register.helpers({//to present the message in the registration page
  RegistrationError: function()
  {
    return Session.get("enemyLogOut");
  }
})
	
	Template.login.events({//
    'submit form': function(event){//when someone submit hsi login information
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;        
        Meteor.loginWithPassword(emailVar, passwordVar, function(err)
        {
          if(err) //check if we have an error                   
          {
            Session.set("enemyLogIn", "Error, Email or Password is inccorect ");//if we do change to message
          }
          else
          {//other wise we succed
            Session.set("enemyLogIn", "");
            Session.set("enemyLogOut", "");
          }

         
        });//log in with the password
    }
  });

  Template.login.helpers({
     LogError: function()//show the message for the login error
    {
       return Session.get("enemyLogIn");
     }
  });

	
	Template.dashboard.events({//for the log out page
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});
	
	   	
	
	/* client/accounts/recover-password.js */

// Ensure we have the token to pass into the template when it's present
if (Accounts._resetPasswordToken) {  
  Session.set('resetPasswordToken', Accounts._resetPasswordToken);
}

Template.RecoverPassword.helpers({  
  resetPassword: function() {
    return Session.get('resetPasswordToken');
  }
});

Template.RecoverPassword.events({  
  'submit #forgot-password': function(event, template) {
    var email = template.find('#user-email'),
      message;

    // You will probably want more robust validation than this!
    if (email) {
      // This will send a link to the address which, upon clicking, prompts the
      //user to enter a new password.
      Accounts.forgotPassword(email);
      message = 'Sent a reset password link to ' + email + '.';
    } else {
      message = 'Please enter a valid email address.'
    }

    // Inform the user.
    template.find('#form-messages').html(message);

    return false;
  },
  'submit #set-new-password': function (event, template) {
    // Proper decoupled validation would be much nicer than this
    var password = template.find('#new-password').value,
      passwordTest = new RegExp("(?=.{6,}).*", "g");

    // If the password is valid, we can reset it.
    if (passwordTest.test(password)) {
      Accounts.resetPassword(
        Session.get('resetPasswordToken'),
        password,
        function (error) {
          if (err) {
            template.find('#form-messages').html('There was a problem resetting your password.');
          } else {
            // Get rid of the token so the forms render properly when they come back.
            Session.set('resetPasswordToken', null);
          }
        })
      } else {
      // Looks like they blew it
      template.find('#form-messages').html('Your password is too weak!');
    }

    return false;
  }
});
	
}


if (Meteor.isServer) {
    // code here will only be run on the server

    
}

