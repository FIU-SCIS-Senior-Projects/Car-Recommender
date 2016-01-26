
//client code
if (Meteor.isClient) {
    
 //sotring message in a session, in case the user send a bad form input   
Session.set("enemyLogIn", "Enter email and password to log on");
Session.set("enemyLogOut", "Fill in the form below to get instant access:");

//event for the dashboard, in case the user click log out
  Template.dashboard.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
  });
  //template event lisiner for the registration form
  Template.register.events({

    'submit form': function(event){//if some submited
        event.preventDefault();//prevent defualt
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var fullnamevar = event.target.registerFullName.value;
        var addressvar = event.target.registerAddress.value;
        var statevar = event.target.registerState.value;
        var zipcodevar = event.target.registerZipCode.value;
        var phonevar = event.target.registerPhoneNum.value;
        Accounts.createUser({//insert into the collection database
            email: emailVar ,
            password: passwordVar ,            
            profile: {
              FullName: fullnamevar,
              Adress: addressvar,
              State: statevar,
              ZipCode: zipcodevar,
              phone: phonevar
            }
        },
        function(err)//in case we have error, such as existing user
        {
          if(err)//present this message 
            Session.set("enemyLogOut", "Error, email is allready taken");
          else
           { //otherwise, change the message, we succed to store the user
            Session.set("enemyLogOut", "Fill in the form below to get instant access:");
            Session.set("enemyLogIn", "Enter email and password to log on");
          }
        }
        );
    }
  });
  //loging event lisenar
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
            Session.set("enemyLogIn", "Enter email and password to log on");
            Session.set("enemyLogOut", "Fill in the form below to get instant access:");
          }

         
        });//log in with the password
    }
  });

  //this is tmeplate for the inside the body, with two forms, login and registration
  Template.htmltables.helpers({
    LogError: function()//show the message for the login error
    {
       return Session.get("enemyLogIn");
     },
     LogOutError:function()//show the message for the registration error
     {
       return Session.get("enemyLogOut");
     }
  });



}

if (Meteor.isServer) {
    // code here will only be run on the server

    
}