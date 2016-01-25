
//client code
if (Meteor.isClient) {
    
Session.set("enemyLogIn", "Enter email and password to log on");
Session.set("enemyLogOut", "Fill in the form below to get instant access:");

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
        },
        function(err)
        {
          if(err)
            Session.set("enemyLogOut", "Error, email is allready taken");
          else
            Session.set("enemyLogOut", "Fill in the form below to get instant access:");
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
          if(err)                   
          {
            Session.set("enemyLogIn", "Error, Email or Password is inccorect ");
          }
          else
          {
            Session.set("enemyLogIn", "Enter email and password to log on");
          }

         
        });//log in with the password
    }
  });

  
   
  

  Template.htmltables.helpers({
    LogError: function()
    {
       return Session.get("enemyLogIn");
     },
     LogOutError:function()
     {
       return Session.get("enemyLogOut");
     }
  });



}

if (Meteor.isServer) {
    // code here will only be run on the server

    
}