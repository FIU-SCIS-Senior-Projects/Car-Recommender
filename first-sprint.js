//routers
Router.configure({
    layoutTemplate: 'main'
});

/*Router.route('/', {
    template: 'login',    
});*/
Router.route('/RecoverPassword');
Router.route('/register');
Router.route('/dashboard');
//Router.route('/home');
Router.route('/about',function()
  {
    this.render('about', {to: 'aside'});
  });
Router.route('/favorites',function()
  {
    this.render('favorites', {to: 'aside'});
  });
Router.route('/sell',function(){
  this.render('sell', {to: 'aside'});
});
Router.route('/contact',function(){
  this.render('contact', {to: 'aside'});
});


Router.route('/', function () {

    this.render('login');
    this.render('home', {to: 'aside'});
});


//client side
if (Meteor.isClient) {

  //message for login and registration
	Session.set("enemyLogIn", "");//login
	Session.set("enemyLogOut", "");//registration
	
	
	Template.sell.helpers({  
    data: { 
		
	year: [{y: "2016"}, {y: "2015"}, {y: "2014"}, {y: "2013"}, {y: "2012"}, {y: "2011"}, {y: "2010"}, 
  		   {y: "2009"}, {y: "2008"}, {y: "2007"}, {y: "2006"}, {y: "2005"}, {y: "2004"}, {y: "2003"}, {y: "2002"}, {y: "2001"},  {y: "2000"},
		   {y: "1999"}, {y: "1998"}, {y: "1997"}, {y: "1996"}, {y: "1995"}, {y: "1994"}, {y: "1993"}, {y: "1992"}, {y: "1991"},  {y: "1990"}],
		
	make: [	{car: "Acura"}, {car: "Alfa Romeo"}, {car: "Aston Martin"}, {car: "Audi"}, {car: "Bentley"}, {car:"BMW"}, {car: "Buick"}, 				   	{car:"Cadillac"}, {car:"Chevrolet"}, {car:"Chrysler"}, {car:"Dodge"}, {car:"Ferrari"}, {car:"Ford"}, {car:"GMC"},
		  	{car:"Honda"}, {car:"HUMMER"}, {car:"Hyundai"}, {car:"Infiniti"}, {car:"Isuzu"}, {car:"Jaguar"}, {car:"Jeep"},
		  	{car:"Kia"}, {car:"Lamborghini"}, {car:"Land Rover"}, {car:"Lexus"}, {car:"Lincoln"}, {car:"Lotus"}, {car:"Maserati"},
		  	{car:"Maybach"}, {car:"Mazda"}, {car: "Mercedes-Benz"}, {car:"Mercury"}, {car:"MINI"}, {car: "Mitsubishi"},  {car:"Nissan"},	
		  	{car:"Oldsmobile"}, {car:"Panoz"}, {car:"Pontiac"}, {car:"Porsche"}, {car:"Rolls-Royce"}, {car:"Saab"}, {car:"Saturn"},
		  	{car:"Scion"}, {car:"Subaru"}, {car:"Suzuki"}, {car:"Toyota"}, {car:"Volkswagen"}, {car:"Volvo"} ],
		
	style: [{s:"Convertible"}, {s:"Coupe"}, {s: "Crossover"}, {s: "Diesel"}, {s:"Hatchback"}, {s: "Hybrid/Electric"}, {s: "Luxury"}, 
			{s: "Minivan/Van"}, {s: "Sedan"}, {s: "SUV"}, {s: "Truck"}, {s: "Wagon"}],
		
	mileage: [{m: "<10"}, {m: "10"}, {m: "11"}, {m: "12"}, {m: "13"}, {m: "14"}, {m: "15"}, {m: "16"}, {m: "17"}, {m: "18"}, {m: "19"},
			  {m: "20"}, {m: "21"}, {m: "22"}, {m: "23"}, {m: "24"}, {m: "25"}, {m: "26"}, {m: "27"}, {m: "28"}, {m: "29"},
			  {m: "30"}, {m: "31"}, {m: "32"}, {m: "33"}, {m: "34"}, {m: "35"}, {m: "36"}, {m: "37"}, {m: "38"}, {m: "39"},
			  {m: "40"}, {m: "41"}, {m: "42"}, {m: "43"}, {m: "44"}, {m: "45"}, {m: "46"}, {m: "47"}, {m: "48"}, {m: "49"},
			  {m: "50"}, {m: "51"}, {m: "52"}, {m: "53"}, {m: "54"}, {m: "55"}, {m: "56"}, {m: "57"}, {m: "58"}, {m: "59"},
			  {m: "60"}, {m: "61"}, {m: "62"}, {m: "63"}, {m: "64"}, {m: "65"}, {m: "66"}, {m: "67"}, {m: "68"}, {m: "69"},
			  {m: "70"}, {m: "71"}, {m: "72"}, {m: "73"}, {m: "74"}, {m: "75"}, {m: ">75"}
			 ],
		
	cylinder: [	{c: "2-Cylinder"}, {c: "4-Cylinder"}, {c: "6-Cylinder"}, {c: "8-Cylinder"}, {c: "10-Cylinder"}, {c: "12-Cylinder"}],
	
	transmission: [	{t: "Automatic"}, {t: "Manual"}],
		
	ecolor: [{c: "Black"}, {c: "Blue"}, {c: "Brown"}, {c: "Gold"}, {c: "Gray"}, {c: "Green"}, {c:"Orange"}, {c:"Purple"}, {c:"Red"}, 		
			{c:"Silver"}, {c:"Tan"}, {c:"White"}, {c:"Yellow"} ],		
	
	icolor: [{c: "Black"}, {c: "Gray"}, {c:"Tan"}]
		
	}
	});

	
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
            	Session.set("enemyLogOut", "Error: email is already taken");
          	else
           	{ 
			    //otherwise, change the message, we succed to store the user
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
	});
	
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
        Router.go('/');
        Meteor.logout();
        
    }
});

  Template.dashboard.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();            
      return template === currentRoute.lookupTemplate().toLowerCase() ? 'active' : '';
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

