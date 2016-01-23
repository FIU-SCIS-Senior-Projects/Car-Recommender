
//client code
if (Meteor.isClient) {
  
  Template.dashboard.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
  });
  //template event lisiner
  Template.register.events({

    'submit form': function(event){//if some submited
        event.preventDefault();//prevent defualt
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var firstnamevar = event.target.registerFirstName.value;
        var lastnamevar = event.target.registerLastName.value;
        var phonevar = event.target.registerPhoneNum.value;
        Accounts.createUser({//insert into the collection database
            email: emailVar ,
            password: passwordVar ,            
            profile: {
              firstName: firstnamevar,
              lastName: lastnamevar,
              phone: phonevar
            }
        });
    }
  });
  //loging event lisenar
  Template.login.events({//
    'submit form': function(event){//when someone submit hsi login information
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar);//log in with the password
    }
  });
}

if (Meteor.isServer) {
    // code here will only be run on the server

    
}