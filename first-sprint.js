//routers
Router.configure({
    layoutTemplate: 'main'
});
Router.route('/RecoverPassword');
Router.route('/register');
Router.route('/dashboard');
Router.route('/profile',function()
  {
    this.render('profile', {to: 'aside'});
  });
Router.route('/favorites',function()
  {
    this.render('favorites', {to: 'aside'});
  });
Router.route('/sell',function(){
  this.render('sell', {to: 'aside'});
});
Router.route('/inventory',function(){
  this.render('inventory', {to: 'aside'});
});
Router.route('/', function () {

    this.render('login');
    this.render('home', {to: 'aside'});
});
Router.route('/updateprofile',function(){
  this.render('updateprofile', {to: 'aside'});
});
Router.route('/updatecars',function(){
  this.render('updatecars', {to: 'aside'});
});
Router.route('/changepassword',function(){
  this.render('changepassword', {to: 'aside'});
});

//collections
//accounts collections containts user information
LikesColllection = new Mongo.Collection("likes-collection");//this is the like collection, containts CARID and EMailBuyer
SellersCollection = new Mongo.Collection('seller-collection');//this is the seller collection, contains CARID,SellerEmail,Sellername,Seller Last name,SellerPhone
CarsCollection = new Mongo.Collection('cars');//this is the cars collection, contains car images, year, make, type, model, mpg, engine and color 
ProfileCollection = new Mongo.Collection('profile');

//client side
if (Meteor.isClient) {

  //message for login and registration
	Session.set("enemyLogIn", "");//login
	Session.set("enemyLogOut", "");//registration
    Session.set('selectedTable', null);//to see if someone clicked the info button  
	
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
            ProfileCollection.insert({
              email: emailVar,
              fname: fnameVar,
              lname: lnameVar,
              phone: telephoneVar,
              address: addressVar,
              state: stateVar, 
              zip: zipVar
            });              
			    //otherwise, change the message, we succed to store the user
            	Session.set("enemyLogOut", "");
            	Session.set("enemyLogIn", "");
               Router.go('/');
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

	 Template.main.helpers({
	 
	   profile: function(){
			var emailCurrentUser = Meteor.user().emails[0].address;
		   	return ProfileCollection.find({ email: emailCurrentUser});
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
	
  //helpers for the home template
	Template.home.helpers({
    cars: function()
    {
      var useremail = Meteor.user().emails[0].address;
      Meteor.call('Recomandation', useremail);//checking if recomandation works      
      return CarsCollection.find({});//get values in the car collections Sellcar       
    }
  });
	
  Template.slidercars.events({//event in the slides
    'click #infobutton': function(event)//if user clicked info button show table info
    {
      event.preventDefault();
      if(!Session.equals('selectedTable', this._id))
      {
        Session.set('selectedTable', this._id);
      }else
      {
        Session.set('selectedTable', null);
      }
    },
    'click #likebutton': function(event)//if user clicked 'like' respond accordinally
    {
      event.preventDefault;        
      //alert(Meteor.user().emails[0].address);
      var useremail = Meteor.user().emails[0].address;
      var item = LikesColllection.findOne({BuyerEmail: useremail,CarID: this.CarID});
      if(typeof item == 'undefined' || item ==null)
      {
       Meteor.call('insertLikeData', useremail, this.CarID);//call server method to insert a like into the collection
      }else
      {        
        Meteor.call('removePlayerData', useremail, this.CarID);//call server method to remove the like
      }
       
    }
  });

  Template.slidercars.helpers({//helpers for the slides
     selected: function(){//check if to show or not to show the table info
    return Session.equals('selectedTable', this._id);
    },
    likesign: function(){//to show the like sign accordinally, based on the like collection
      var useremail = Meteor.user().emails[0].address;
      var item = LikesColllection.findOne({BuyerEmail: useremail,CarID: this.CarID}); 
      //alert(useremail);
      return (typeof item == 'undefined' || item == null ||typeof this.CarID == 'undefined')?"glyphicon glyphicon-ok":"glyphicon glyphicon-check";
    },
    popoverdata: function()//this for contact information
    {        
      var item =  SellersCollection.findOne({CarID: this.CarID});
      //alert(item);
      var data = "Name: "+item.fname+" "+item.lname+"<br>" + "Email: "+item.email+"<br>"+"Phone: "+item.phone;
      return data;
    }
});

 Template.sell.events({
    'submit form': function(event) {//insert the user name to database
    //event.preventDefault();
    var emailVar = Meteor.user().emails[0].address;   
    //var pictureVar = event.target.picture.files[0];
    var pictureVar = event.target.picture.value;
    var priceVar = event.target.price.value;
    var yearVar = event.target.year.value;
    var makeVar = event.target.make.value;
    var typeVar = event.target.type.value;
    var modelVar = event.target.model.value;
    var mileageVar = event.target.mileage.value;
    var cmpgVar = event.target.cmpg.value;
    var hmpgVar = event.target.hmpg.value;
    var engineVar = event.target.engine.value;
    var cylinderVar = event.target.cylinder.value;
    var ecolorVar = event.target.ecolor.value;
    var icolorVar = event.target.icolor.value;
    var carIDVar = Random.id();    
    var Useraccount = ProfileCollection.findOne({email: emailVar});

    CarsCollection.insert({
      CarID: carIDVar,
      email: emailVar,
      picture: pictureVar,
      year: yearVar,
      make: makeVar,
      type: typeVar,
      model: modelVar,
      mileage: mileageVar,
      cmpg: cmpgVar,
      hmpg: hmpgVar,
      price: priceVar,
      engine: engineVar,
      cylinder: cylinderVar,
      ecolor: ecolorVar,
      icolor: icolorVar
    });

    //new for the seller collection
    SellersCollection.insert({
      CarID: carIDVar,
      email: Useraccount.email,
      fname: Useraccount.fname,
      lname: Useraccount.lname,
      phone: Useraccount.phone,
      address: Useraccount.address,
      state: Useraccount.state, 
      zip: Useraccount.zip
    });

  }
});
    
  Template.sell.helpers({  
  
  data: { 
    
  year: [{y: "2016"}, {y: "2015"}, {y: "2014"}, {y: "2013"}, {y: "2012"}, {y: "2011"}, {y: "2010"}, 
         {y: "2009"}, {y: "2008"}, {y: "2007"}, {y: "2006"}, {y: "2005"}, {y: "2004"}, {y: "2003"}, {y: "2002"}, {y: "2001"},  {y: "2000"},
       {y: "1999"}, {y: "1998"}, {y: "1997"}, {y: "1996"}, {y: "1995"}, {y: "1994"}, {y: "1993"}, {y: "1992"}, {y: "1991"},  {y: "1990"}],
    
  make: [ {car: "Acura"}, {car: "Alfa Romeo"}, {car: "Aston Martin"}, {car: "Audi"}, {car: "Bentley"}, {car:"BMW"}, {car: "Buick"},             {car:"Cadillac"}, {car:"Chevrolet"}, {car:"Chrysler"}, {car:"Dodge"}, {car:"Ferrari"}, {car:"Ford"}, {car:"GMC"},
        {car:"Honda"}, {car:"HUMMER"}, {car:"Hyundai"}, {car:"Infiniti"}, {car:"Isuzu"}, {car:"Jaguar"}, {car:"Jeep"},
        {car:"Kia"}, {car:"Lamborghini"}, {car:"Land Rover"}, {car:"Lexus"}, {car:"Lincoln"}, {car:"Lotus"}, {car:"Maserati"},
        {car:"Maybach"}, {car:"Mazda"}, {car: "Mercedes-Benz"}, {car:"Mercury"}, {car:"MINI"}, {car: "Mitsubishi"},  {car:"Nissan"},  
        {car:"Oldsmobile"}, {car:"Panoz"}, {car:"Pontiac"}, {car:"Porsche"}, {car:"Rolls-Royce"}, {car:"Saab"}, {car:"Saturn"},
        {car:"Scion"}, {car:"Subaru"}, {car:"Suzuki"}, {car:"Toyota"}, {car:"Volkswagen"}, {car:"Volvo"} ],
    
  style: [{s:"Convertible"}, {s:"Coupe"}, {s: "Crossover"}, {s: "Diesel"}, {s:"Hatchback"}, {s: "Hybrid/Electric"}, {s: "Luxury"}, 
      {s: "Minivan/Van"}, {s: "Sedan"}, {s: "SUV"}, {s: "Truck"}, {s: "Wagon"}],
    
  cylinder: [ {c: "2-Cylinder"}, {c: "4-Cylinder"}, {c: "6-Cylinder"}, {c: "8-Cylinder"}, {c: "10-Cylinder"}, {c: "12-Cylinder"}],
  
  transmission: [ {t: "Automatic"}, {t: "Manual"}],
    
  ecolor: [{c: "Black"}, {c: "Blue"}, {c: "Brown"}, {c: "Gold"}, {c: "Gray"}, {c: "Green"}, {c:"Orange"}, {c:"Purple"}, {c:"Red"},    
      {c:"Silver"}, {c:"Tan"}, {c:"White"}, {c:"Yellow"} ],   
  
  icolor: [{c: "Black"}, {c: "Gray"}, {c:"Tan"}]
    
  }
  });


  Template.profile.helpers({//to present the message in the registration page
    profile: function(){
      var emailCurrentUser = Meteor.user().emails[0].address;
        return ProfileCollection.find({ email: emailCurrentUser});
    }
  });
  
  Template.inventory.events({
	   'submit form': function(event) {
    	event.preventDefault();
		  var carIDVar = event.target.carID.value;
		   console.log(carIDVar);
		   console.log('damnit');
		   alert(carIDVar);
	   }
   });
	
  Template.inventory.helpers({//to present the message in the registration page
    cars: function(){
      var emailCurrentUser = Meteor.user().emails[0].address;
        return CarsCollection.find({ email: emailCurrentUser});
    }
  });
  
 Template.favorites.events({
    'click #favoritesshow': function(event)
    {
      $(event.target).prevAll("#FavoritesInformation1").first().show();
      $(event.target).prevAll("#FavoritesInformation2").first().show();
    }
  });

  Template.favorites.helpers({//favorites template
    carFavorites: function()
    {
      var useremail = Meteor.user().emails[0].address;
      var item = LikesColllection.find({BuyerEmail: useremail});
      return item;
    },
    CarsInfo: function()
    {
      var item = CarsCollection.findOne({CarID: this.CarID});
      return item;
    },
    ContactInfo: function()
    {
      var item =  SellersCollection.findOne({CarID: this.CarID});
      return item;
    }
  });

	
Template.updateprofile.events({
	  'submit form': function(event) {
		  var fnameVar = event.target.firstName.value;  
	   	  var lnameVar = event.target.lastName.value;
	   	  var addressVar = event.target.address.value;
	      var stateVar = event.target.state.value;	
	      var zipVar = event.target.zipcode.value;
	      var phoneVar = event.target.phone.value;	  
         
		  // get current user profile
	      var emailCurrentUser = Meteor.user().emails[0].address;	  
	      var item =  ProfileCollection.findOne({email: emailCurrentUser});
		  // item_id stores current user profile ID
		  // Meteor.userId() fetches the current account user ID
		  
		  if (fnameVar.length) 
		  {  
		  	ProfileCollection.update(item._id, {$set: {fname: fnameVar}});
			Meteor.users.update(Meteor.userId(), {$set: {'profile.fname': fnameVar}});  
		  }
		  if (lnameVar.length) 
		  {  
       		ProfileCollection.update(item._id, {$set: {lname: lnameVar}});
			Meteor.users.update(Meteor.userId(), {$set: {'profile.lname': lnameVar}});   
		  }
	   	  if (addressVar.length) 
		  {  
		  	ProfileCollection.update(item._id, {$set: {address: addressVar}});
			Meteor.users.update(Meteor.userId(), {$set: {'profile.address': addressVar}});   
		  }
		  if (stateVar.length) 
		  {  
       		ProfileCollection.update(item._id, {$set: {state: stateVar}});
			Meteor.users.update(Meteor.userId(), {$set: {'profile.state': stateVar}});   
		  }
		  if (zipVar.length) 
		  {  
		  	ProfileCollection.update(item._id, {$set: {zip: zipVar}});
			Meteor.users.update(Meteor.userId(), {$set: {'profile.zip': zipVar}});  
		  }
		  if (phoneVar.length) 
		  {  
       		ProfileCollection.update(item._id, {$set: {phone: phoneVar}});
			Meteor.users.update(Meteor.userId(), {$set: {'profile.telephone': phoneVar}});   
		  }
	  }
  });
	
 Template.updateprofile.helpers({
    profile: function(){
      var emailCurrentUser = Meteor.user().emails[0].address;
        return ProfileCollection.find({ email: emailCurrentUser});
    }
  });
  
 Template.changepassword.events({
	  'submit form': function(event) {
	  	  var oldPasswordVar = event.target.oldPassword.value;  
	   	  var newPasswordVar = event.target.newPassword.value;
	   	  var confirmNewPasswordVar = event.target.confirmNewPassword.value;
		  Accounts.changePassword(oldPasswordVar, newPasswordVar, function(err)
		  {
			  if (err) {
				alert("Error changing password");
			  } 
			  else { 
				alert("Password succesfully changed");
			  }
		   });						  
	}
 });
	
Template.updatecars.helpers({//to present the message in the registration page
    cars: function(){
      var emailCurrentUser = Meteor.user().emails[0].address;
        return CarsCollection.find({ email: emailCurrentUser});
    }
  });	


//start of unfinisheed section - please ingnore
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
//end of this unfinisheed section	  	
}


if (Meteor.isServer) {
    // code here will only be run on the server

    Meteor.methods({
    'insertLikeData': function(userEmail,carId){
        var item = LikesColllection.findOne({BuyerEmail: userEmail,CarID:carId});
        if(typeof item == 'undefined' || item ==null)
        {
          LikesColllection.insert({
              BuyerEmail: userEmail,
              CarID: carId           
          });
        }
    },
    'removePlayerData': function(userEmail,carId){     
     //   alert("its got to this section")   ;
        LikesColllection.remove({BuyerEmail: userEmail,CarID:carId});
    },
    'Recomandation': function(useremail)
    {
      var svm = Meteor.npmRequire('svm');
      var SVM = new svm.SVM();  
      var options = {
      kernel: 'rbf',
      rbfsigma: 0.5
      }         
      var items = LikesColllection.find({BuyerEmail: useremail}).fetch();
      //var zeev =[[1,2,3],[3,3,0],[1,1,1],[2,2,2],[3,0,3],[0,3,3],[5,1,0],[0,1,1],[5,10,6],[7,0,0],[1,1,0],[5,2,6]];
      //var zeevl =  [1, 1,1,1,1,1,1,1,1,1,1,1];
      //SVM.train(zeev, zeevl, options);         
      //console.log(SVM.predict([[1,2,3],[3,3,0],[1,1,1],[2,2,2],[3,0,3],[0,3,3],[5,1,0],[6,0,0],[2,0,4],[0,0,1],[1003234323,321312542324,919192943242]]));            
      
      var array = [];
      var testArray= [];
      var labels = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) 
      {
        i = items[_i];
        var carItem = CarsCollection.findOne({CarID: i.CarID},{fields: {'_id':0 , 'CarID':0,'picture':0}});
        //console.log('carItem.price');
        for(var z in carItem)
        {            
           // console.log(hashCode(carItem[z]));
           array.push(hashCode(carItem[z]));
        }
        //console.log(x);
        testArray.push(array);
        labels.push(1);
        array = [];        
      }
      //now adding for label -1, we will add from the last
      var len = items.length;
      var count = 0;
      var index = 0;
      array = [];  
      items = CarsCollection.find({}).fetch();
      var len2 = items.length;         
      while(count < len && index < len2)
      {
         index++;
         i = items[len2 - index - 1];                  
         var carItem = LikesColllection.findOne({BuyerEmail: useremail,CarID: i.CarID});
          if(typeof carItem == 'undefined' || carItem ==null)
          {
            count++;
            var Caritems = CarsCollection.findOne({CarID: i.CarID},{fields: {'_id':0 , 'CarID':0,'picture':0}});
            for(var z in Caritems) 
            {
              if(typeof Caritems[z] == 'undefined' || Caritems[z] == null)
               array.push(0) ;
             else
              array.push(hashCode(Caritems[z]));
            }
            testArray.push(array);
            labels.push(-1);
            array = [];
          }
      }            
      console.log(testArray);
      console.log(labels);
      SVM.train(testArray,labels,options);
      var result = SVM.predict([[801848403,2015,1442395159,2007408851,3619,19,100,1000,60000,617328117,1644574353,69066467,64266207]]);
      console.log(result[0]);     
    }
});

//external helper function
//hash function from string to a number
function hashCode(str)
{
  if(isNaN(str)==false)return Math.abs(str);
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
	
}

