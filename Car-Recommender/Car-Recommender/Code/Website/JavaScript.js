//routers
Router.configure({
    layoutTemplate: 'main'
});
Router.route('/password');
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
Router.route('/details',function(){
  this.render('details', {to: 'aside'});
});
Router.route('/changepassword',function(){
  this.render('changepassword', {to: 'aside'});
});
Router.route('/contactseller',function(){
  this.render('contactseller', {to: 'aside'});
});


//collections
//accounts collections containts user information
LikesColllection = new Mongo.Collection("likes-collection");//this is the like collection, containts CARID and EMailBuyer
//**************pls delete SellersCollections collection, it will be usless since we allready have a profile collection and a car collection, *********
SellersCollection = new Mongo.Collection('seller-collection');//this is the seller collection, contains CARID,SellerEmail,Sellername,Seller Last name,SellerPhone
CarsCollection = new Mongo.Collection('cars');//this is the cars collection, contains car images, year, make, type, model, mpg, engine and color 
ProfileCollection = new Mongo.Collection('profile');
SVMCollection = new Mongo.Collection(null);//this is client only collection

//client side
if (Meteor.isClient) {

  //message for login and registration
	Session.set("enemyLogIn", "");//login
	Session.set("enemyLogOut", "");//registration
  Session.set('selectedTable', null);//to see if someone clicked the info button
  Session.set('smartArray',null);
	
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
		  //return Meteor.users.findOne({'emails.0.address': emailCurrentUser});
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

	//home on created , it calls the recomandation algorithm
  Template.home.onCreated(function () {//recomandation algorithm done by Zeev Feldbeine, Copy Rights
     var useremail = Meteor.user().emails[0].address;
     Meteor.call('Recomandation',useremail, function(err, res) {
        //console.log(res);
       Session.set('smartArray',res);
        //return res;
      });  

  });

  //helpers for the home template
	Template.home.helpers({//recomandation algorithm done by Zeev Feldbeine, Copy Rights
    cars: function()
    {
      //var useremail = Meteor.user().emails[0].address;
      //var x = Meteor.call('Recomandation', useremail);//checking if recomandation works
      //console.log(x);      
      var x =Session.get('smartArray');
      //console.log(x);
      return x;
     // return CarsCollection.find({});//get values in the car collections Sellcar       
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
	 'click #contactbutton': function(event)
      {
      	event.preventDefault;        
		Session.set('carID', this.CarID);  
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
    var makeVar = event.target.selectMake.value;
    var modelVar = event.target.selectModel.value;
	var yearVar = event.target.selectYear.value;
	var styleVar = event.target.selectStyle.value;
	var colorVar = event.target.selectColor.value;
	var mileageVar = event.target.mileage.value;
	var priceVar = event.target.price.value;
	var mpgCityVar = event.target.mpg_city.value;
	var mpgHighwayVar =	event.target.mpg_highway.value;
	var marketVar = event.target.market.value;
	var vehicleSizeVar = event.target.vehicleSize.value;
	var vehicleStyleVar = event.target.vehicleStyle.value;
	var vehicleTypeVar = event.target.vehicleType.value;
	var horsepowerVar =	event.target.horsepower.value;
	var configurationVar =	event.target.configuration.value;
	var cylinderVar = event.target.cylinder.value;
	var fuelTypeVar = event.target.fuelType.value;
	var typeVar = event.target.type.value;
	var numOfDoorsVar =	event.target.numOfDoors.value;
	var squishVinVar = event.target.squishVin.value;
	var equipmentTypeVar = event.target.equipmentType.value;
	var transmissionTypeVar	= event.target.transmissionType.value;
	var trimVar = event.target.trim.value;
	var submodelBodyVar = event.target.submodel_body.value;
	var submodelModelNameVar = event.target.submodel_modelName.value;	
	var moreOptionsVar = event.target.options.value;	
    var carIDVar = Random.id();    
    var Useraccount = ProfileCollection.findOne({email: emailVar});//this can be derived, 

    CarsCollection.insert({
      CarID: carIDVar,
      email: emailVar,
      picture: pictureVar,
      year: yearVar,
      make: makeVar,
      model: modelVar,
      mileage: mileageVar,
	  style: styleVar,
      price: priceVar,
      color: colorVar,
	  mpgCity: mpgCityVar, 
	  mpgHighway: mpgHighwayVar,
	  market: marketVar, 
	  vehicleSize: vehicleSizeVar,
	  vehicleStyle: vehicleStyleVar,
      vehicleType: vehicleTypeVar, 
      horsepower: horsepowerVar,
      configuration: configurationVar,
      cylinder: cylinderVar,
      fuelType: fuelTypeVar,
      type: typeVar,
      numOfDoors: numOfDoorsVar,
	  squishVin: squishVinVar, 
	  equipmentType: equipmentTypeVar, 
	  transmissionType: transmissionTypeVar,
	  trim: trimVar, 
	  submodelBody: submodelBodyVar, 
	  submodelModelName: submodelModelNameVar,
	  moreOptions: moreOptionsVar	
    });

    //this section  can be derived from the profilecollection
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
    });//

  }
});
	
 Template.profile.events({
	  'click #deleteprofilebutton': function(event)
      {
			 alert("We're sorry to see you go. To reactivate your account, register again with the same email, your account data (such as profile information, favorites list, car inventory, etc.) will be fully restored.");	
		    Meteor.users.remove({ _id: Meteor.userId() }, function (error, result) {
			if (error) {
			  console.log("Error removing user: ", error);
			} else {
			  console.log("Number of users removed: " + result);
			}
		  });
      }
	 
 });	
	
 Template.profile.helpers({//to present the message in the registration page
    profile: function(){
      var emailCurrentUser = Meteor.user().emails[0].address;
        return ProfileCollection.findOne({ email: emailCurrentUser});
    }
  });
  

  Template.inventory.events({
	  'click #updatecarbutton': function(event)
      {
      	event.preventDefault;        
        Session.set('key', this.CarID);
      },
	  'click #details': function(event)
      {
      	event.preventDefault;        
        Session.set('key', this.CarID);
      },
	  	
	  'click #deletecarbutton': function(event)
      {
      	event.preventDefault;        
  	    var item = CarsCollection.findOne({CarID: this.CarID});
		CarsCollection.remove(item._id);
      }
 });
	
	  
	
  Template.inventory.helpers({//to present the message in the registration page
    cars: function(){
      var emailCurrentUser = Meteor.user().emails[0].address;
        return CarsCollection.find({ email: emailCurrentUser});
    }
  });
  
  Template.details.events({
	  'click #updatecarbutton': function(event)
      {
      	event.preventDefault;        
        Session.set('key', this.CarID);
      },
	  'click #deletecarbutton': function(event)
      {
      	event.preventDefault;  
		var temp = Session.get('key');
  	    var item = CarsCollection.findOne({CarID: temp});
		CarsCollection.remove(item._id);
      }
 });
	
Template.details.helpers({
	cars: function(){
      var temp = Session.get('key');
        return CarsCollection.findOne({ CarID: temp});
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
        return ProfileCollection.findOne({ email: emailCurrentUser});
    }
  });
  
 Template.changepassword.events({
	  'submit form': function(event) {
	  	  var oldPasswordVar = event.target.oldPassword.value;  
	   	  var newPasswordVar = event.target.newPassword.value;
	   	  var confirmNewPasswordVar = event.target.confirmNewPassword.value;
		  alert("ALERT: You are about to be automatically logged out. Login to your account using your new brand password.");
		  Accounts.changePassword(oldPasswordVar, newPasswordVar);
		  accountsClient.logout(); 
	}
 });
	
Template.updatecars.events({
 	'submit form': function(event) 
  {
		   	//event.preventDefault();
		  var pictureVar = event.target.picture.value;
			var makeVar = event.target.selectMake.value;
			var modelVar = event.target.selectModel.value;
			var yearVar = event.target.selectYear.value;
			var styleVar = event.target.selectStyle.value;
			var colorVar = event.target.selectColor.value;
			var mileageVar = event.target.mileage.value;
			var priceVar = event.target.price.value;
			var mpgCityVar = event.target.mpg_city.value;
			var mpgHighwayVar =	event.target.mpg_highway.value;
			var marketVar = event.target.market.value;
			var vehicleSizeVar = event.target.vehicleSize.value;
			var vehicleStyleVar = event.target.vehicleStyle.value;
			var vehicleTypeVar = event.target.vehicleType.value;
			var horsepowerVar =	event.target.horsepower.value;
			var configurationVar =	event.target.configuration.value;
			var cylinderVar = event.target.cylinder.value;
			var fuelTypeVar = event.target.fuelType.value;
			var typeVar = event.target.type.value;
			var numOfDoorsVar =	event.target.numOfDoors.value;
			var squishVinVar = event.target.squishVin.value;
			var equipmentTypeVar = event.target.equipmentType.value;
			var transmissionTypeVar	= event.target.transmissionType.value;
			var trimVar = event.target.trim.value;
			var submodelBodyVar = event.target.submodel_body.value;
			var submodelModelNameVar = event.target.submodel_modelName.value;	
			var moreOptionsVar = event.target.options.value;	
				     
		    //get the CarID
		    var carIDVar = Session.get('key');
		    //find the corresponding car collection
		    var item = CarsCollection.findOne({CarID: carIDVar});
			if (trimVar.length) 
		  		CarsCollection.update(item._id, {$set: {trim: trimVar}});
			if (submodelBodyVar.length) 
					CarsCollection.update(item._id, {$set: {submodelBody: submodelBodyVar}});
			if (submodelModelNameVar.length) 
					CarsCollection.update(item._id, {$set: {submodelModelName: submodelModelNameVar}});
			if (moreOptionsVar.length) 
					CarsCollection.update(item._id, {$set: {moreOptions: moreOptionsVar}});		
			if (typeVar.length) 
					CarsCollection.update(item._id, {$set: {type: typeVar}});
			if (numOfDoorsVar.length) 
					CarsCollection.update(item._id, {$set: {numOfDoors: numOfDoorsVar}});
			if (squishVinVar.length) 
					CarsCollection.update(item._id, {$set: {squishVin: squishVinVar}});
			if (equipmentTypeVar.length) 
					CarsCollection.update(item._id, {$set: {equipmentType: equipmentTypeVar}});
			if (transmissionTypeVar.length) 
					CarsCollection.update(item._id, {$set: {transmissionType: transmissionTypeVar}});		   
			if (vehicleTypeVar.length) 
					CarsCollection.update(item._id, {$set: {vehicleType: vehicleTypeVar}});
			if (horsepowerVar.length) 
					CarsCollection.update(item._id, {$set: {horsepower: horsepowerVar}});
			if (configurationVar.length) 
					CarsCollection.update(item._id, {$set: {configuration: configurationVar}});
			if (cylinderVar.length) 
					CarsCollection.update(item._id, {$set: {cylinder: cylinderVar}});
			if (fuelTypeVar.length) 
					CarsCollection.update(item._id, {$set: {fuelType: fuelTypeVar}});		
		    if (pictureVar.length) 
		  			CarsCollection.update(item._id, {$set: {picture: pictureVar}});
		    if (makeVar.length) 
		  			CarsCollection.update(item._id, {$set: {make: makeVar}});
		    if (modelVar.length) 
		  			CarsCollection.update(item._id, {$set: {model: modelVar}});
		  	if (yearVar.length)
		  			CarsCollection.update(item._id, {$set: {year: yearVar}});
		  	if (priceVar.length) 
		  			CarsCollection.update(item._id, {$set: {price: priceVar}});
		  	if (styleVar.length) 
		  			CarsCollection.update(item._id, {$set: {style: styleVar}});
		  	if (mileageVar.length) 
		  			CarsCollection.update(item._id, {$set: {mileage: mileageVar}});
		  	if (colorVar.length) 
		  			CarsCollection.update(item._id, {$set: {color: colorVar}});
		  	if (mpgCityVar.length) 
		  			CarsCollection.update(item._id, {$set: {mpgCity: mpgCityVar}});
		  	if (mpgHighwayVar.length) 
		  			CarsCollection.update(item._id, {$set: {mpgHighway:  mpgHighwayVar}});
		 	if (marketVar.length) 
		  			CarsCollection.update(item._id, {$set: {market: marketVar}});
		 	if (vehicleSizeVar.length) 
		  			CarsCollection.update(item._id, {$set: {vehicleSize: vehicleSizeVar}});
		 	if (vehicleStyleVar.length) 
		  			CarsCollection.update(item._id, {$set: {vehicleStyle: vehicleStyleVar}});
	}
});	
	
Template.updatecars.helpers({//to present the message in the registration page
    cars: function(){
      var temp = Session.get('key');
        return CarsCollection.findOne({ CarID: temp});
    }
});


  Template.homelayoutview.events({//copyrights zeev feldbeine
   //Brenda's part
	  'click #contactbutton': function(event)
      {
      	event.preventDefault;        
		Session.set('carID', this.CarID);  
	  },
	  // end of Brenda's part
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
    },
    'click #mapbutton': function(event)
    {
      Session.set('mapID',this.CarID);
      
      var useremail = Meteor.user().emails[0].address;      
      Meteor.call('GetLocation', useremail, function(err, res) {        
        Session.set('orgin',res);
      });//call server method to remove the like                   
       
       Meteor.call('GetLocation', this.email, function(err, res) {        
        Session.set('dest',res);
      });       
      $("#myModal").on("shown.bs.modal", function () {
      google.maps.event.trigger(map, "resize");
      var x= Session.get('dest');
      var y= Session.get('orgin');
      map.setCenter({lat: y.latitude, lng: y.longitude});
      map.setZoom(6);

        // Set destination, origin and travel mode.
      request = {
        destination: {lat: x.latitude, lng: x.longitude},
        origin: {lat: y.latitude, lng: y.longitude},
        travelMode: google.maps.TravelMode.DRIVING
      };

      // Pass the directions request to the directions service.
      directionsService = new google.maps.DirectionsService();
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          // Display the route on the map.
          directionsDisplay.setDirections(response);
        }

      });      

      });
    }     
  });
  //helpers for the home template
  Template.homelayoutview.helpers({//recomandation algorithm done by Zeev Feldbeine, Copy Rights
    cars: function()
    {
      var x =Session.get('smartArray');
      return x;     
    },
    likesign: function(){//to show the like sign accordinally, based on the like collection
      var useremail = Meteor.user().emails[0].address;
      var item = LikesColllection.findOne({BuyerEmail: useremail,CarID: this.CarID}); 
      //alert(useremail);
      return (typeof item == 'undefined' || item == null ||typeof this.CarID == 'undefined')?"Like":"Dislike";
    },
    popoverdata: function()//this for contact information
    {        
      var item =  SellersCollection.findOne({CarID: this.CarID});
      //alert(item);
      var data = "Name: "+item.fname+" "+item.lname+"<br>" + "Email: "+item.email+"<br>"+"Phone: "+item.phone;
      return data;
    }    
  });

  Template.templatemodle.helpers({
    Cars: function()
    {
      var x = Session.get('mapID');
      return CarsCollection.findOne({CarID:x});
    },
    destination: function()
    {
      return Session.get('dest');           
    },
    origin: function()
    {
       return Session.get('orgin');
    }    

  });

 Template.password.events({
	  'submit form': function(event) {
		  event.preventDefault();
	  	  var emailCurrentUser = event.target.email.value;  
		  Accounts.forgotPassword({email: emailCurrentUser},function(err) {
			if (err) {
			  if (err.message === 'User not found [403]') {
				alert('This email does not exist.');
			  } else {
				alert('We are sorry but something went wrong.');
			  }
			} else {
			  alert('Email Sent. Check your mailbox.');
			}
      });
	  }

 });
	
Template.contactseller.events({  
	'submit form': function(event) {
    //event.preventDefault();
    var buyerNameVar = event.target.buyername.value;
	//console.log("FROM: " + buyerNameVar);	
	var buyerEmailVar = event.target.buyeremail.value;		
	var buyerPhoneVar = event.target.buyerphone.value;
	var subjectVar = event.target.subject.value;		
	var messageVar = event.target.message.value;	
	var sellerEmailVar = event.target.selleremail.value;	
	
	var finalSubject = "CRS: I am interested in your " + subjectVar + "!";
	var finalMessage = "Hello,\n\nMy name is " + buyerNameVar + ". " + messageVar + " You can reach out to me at " + buyerPhoneVar + " or by email.\n\nHope to hear from you soon.";	
	Meteor.call('sendEmail',
            sellerEmailVar,
            buyerEmailVar,
            finalSubject,
            finalMessage);	
      alert('Your message has been sent.');
	}
});
	
  Template.contactseller.helpers({  
     cars: function(){
		var car_id = Session.get('carID');  
			return CarsCollection.findOne({CarID: car_id}); 
	},
	  profile: function(){
			return ProfileCollection.findOne({email: Meteor.user().emails[0].address}); 
	}
  
  });	
 

//end of client 
}

	

if (Meteor.isServer) 
{
    // code here will only be run on the server
	 Meteor.users.allow({remove: function () { return true; }});
	
	Meteor.startup( function() {
		process.env.MAIL_URL =  'smtp://postmaster%40sandbox71546b4e0f2a44b4a19fb25a281ae0c7.mailgun.org:f37fbd3c612983aa87a538bff80911f2@smtp.mailgun.org:587';
		Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false}) 
	});
	
    Meteor.methods({	
		'sendEmail': function (to, from, subject, text) {
		//check([to, from, subject, text], [String]);

		// Let other method calls from the same client start running,
		// without waiting for the email sending to complete.
		this.unblock();

		Email.send({
		  to: to,
		  from: from,
		  subject: subject,
		  text: text
		});
		
		var new_subject = "From a CRS Seller";	
		var new_text = "Thank you! I received your inquiry. I will be contacting you soon.";
		this.unblock();	
		Email.send({
		  to: from,
		  from: to,
		  subject: new_subject,
		  text: new_text
		});	
  },
	
  'insertLikeData': function(userEmail,carId){//recomandation algorithm done by Zeev Feldbeine, Copy Rights
        var item = LikesColllection.findOne({BuyerEmail: userEmail,CarID:carId});
        if(typeof item == 'undefined' || item ==null)
        {
          LikesColllection.insert({
              BuyerEmail: userEmail,
              CarID: carId           
          });
        }
    },
    'removePlayerData': function(userEmail,carId){//recomandation algorithm done by Zeev Feldbeine, Copy Rights     
     //   alert("its got to this section")   ;
        LikesColllection.remove({BuyerEmail: userEmail,CarID:carId});
    },
    'Recomandation': function(useremail)//recomandation algorithm done by Zeev Feldbeine, Copy Rights
    {
      SVMCollection.remove({});
      var svm = Meteor.npmRequire('svm');
      var SVM = new svm.SVM();  
      var options = {
      kernel: 'rbf',
      rbfsigma: 0.5
      }
      //check if user does not have any likes
      if(LikesColllection.find({BuyerEmail: useremail}).count() <= 0 )
      {
        return CarsCollection.find({}).fetch();
      }
      var items = LikesColllection.find({BuyerEmail: useremail}).fetch();
      var array = [];
      var testArray= [];
      var labels = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) 
      {
        i = items[_i];
        if(typeof i.CarID == 'undefined') continue;
        var carItem = CarsCollection.findOne({CarID: i.CarID},{fields: {'_id':0 , 'CarID':0,'picture':0}});
        //console.log('carItem.price');
        for(var z in carItem)
        {            
          if(typeof carItem[z] == 'undefined' || carItem[z] == null)
           array.push(0) ;           
         else
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
         if(typeof i == 'undefined'|| typeof i.CarID == 'undefined') continue;                  
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
      //console.log(testArray);
      //console.log(labels);
      SVM.train(testArray,labels,options);     
      //console.log(result);
      //now we put create a cleint arry and put the correct value on them to predict
      CreatePrediction(SVM,useremail);
//      console.log(SVMCollection.find({}).count()); 
      //return SVMCollection.find({});
       return SVMCollection.find({}, {sort: {rank: -1,distance: 1}}).fetch();
    },
    'GetLocation': function(emailuser)//get zip location done by Zeev Feldbeine, Copy Rights
    {
      return GetUserLocation(emailuser);
    }
});

//using SVM to predict all the ther results
function CreatePrediction(SVM,useremail)//recomandation algorithm done by Zeev Feldbeine, Copy Rights
{
      var Parray = [];
      var Prediction = [];
      items = CarsCollection.find({}).fetch();      
      for (_i = 0, _len = items.length; _i < _len; _i++) 
      {
        i = items[_i];
        if(typeof i.CarID == 'undefined') continue;        
        var carItem = CarsCollection.findOne({CarID: i.CarID});        
        for(var z in carItem) 
        {
          if(!(z == '_id' || z == 'CarID' || z == 'picture'))
          {
              if(typeof carItem[z] == 'undefined' || carItem[z] == null)
               Parray.push(0) ;
             else
              Parray.push(hashCode(carItem[z]));            
          }
        }        
        Prediction.push(Parray);
        var result = SVM.predict(Prediction);        
        var DistanceResult = GetDistanceZip(carItem.email,useremail);//new shit        
        InsertToSVMCollection(carItem,result,DistanceResult);        
        Prediction = [];
        Parray = [];
      }
                 
}
//helper function to insert to the tempory collections
function InsertToSVMCollection(carItem,result,DistanceResult)//recomandation algorithm done by Zeev Feldbeine, Copy Rights
{      
      SVMCollection.insert({
      CarID: carItem.CarID,
      email: carItem.email,
      picture: carItem.picture,
      year: carItem.year,
      make: carItem.make,
      type: carItem.type,
      model: carItem.model,
      mileage: carItem.mileage,
      mpgCity: carItem.mpgCity,
      mpgHighway: carItem.mpgHighway,
      price: carItem.price,
      horsepower: carItem.horsepower,
      cylinder: carItem.cylinder,
      color: carItem.color,
      style: carItem.style,
      distance: DistanceResult,
      rank: result
    });
}

//external helper function
//hash function from string to a number
function hashCode(str)//recomandation algorithm done by Zeev Feldbeine, Copy Rights
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

//external helper function
//calculate navigation distance between two points of latitude and longitude
//this function is Haversine formula, which is a famous navigation algorithm to calculate distance between two points in the map
//developed and implemented by Zeev Feldbeine, Copy Rights
function haversine(lat1,lng1,lat2,lng2) 
{
    r = 6371; // average radius of the earth in km
    dLat = Math.toRadians(lat2 - lat1);
    dLon = Math.toRadians(lng2 - lng1);
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))  * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    d = r * c;
    return d;
}

//calculate distance based on based on harversine and database history
function GetDistanceZip(Selleremail,useremail)//developed and implemented by Zeev Feldbeine, Copy Rights
{    
  if(typeof Selleremail == 'undefined' ||typeof useremail == 'undefined' || Selleremail == null || useremail == null) return Number.MAX_VALUE;
  var profileUser1= ProfileCollection.findOne({ email: useremail});
  var profileUser2= ProfileCollection.findOne({ email: Selleremail});  
  if(typeof profileUser1 == 'undefined' ||typeof profileUser2 == 'undefined' ) return Number.MAX_VALUE;
  var zipcodes = Meteor.npmRequire('zipcodes');  
  var zip1 = Math.abs(profileUser1.zip);
  if(typeof zipcodes.lookup(zip1) == 'undefined') return Number.MAX_VALUE;
  var zip2 = Math.abs(profileUser2.zip);
  if(typeof zipcodes.lookup(zip2) == 'undefined') return Number.MAX_VALUE;
  return zipcodes.distance(zip1, zip2); //In Miles
}

//returns the location of user by email
function GetUserLocation(useremail)//developed and implemented by Zeev Feldbeine, Copy Rights
{    
//  if(typeof useremail == 'undefined' || useremail == null) return Number.MAX_VALUE;
  var profileUser1= ProfileCollection.findOne({ email: useremail});  
  if(typeof profileUser1 == 'undefined') return null;
  var zipcodes = Meteor.npmRequire('zipcodes');  
  var zip1 = Math.abs(profileUser1.zip);
  var location = zipcodes.lookup(zip1);
  if(typeof location == 'undefined') return zipcodes.lookup(33180);
  return location;
}

	
}