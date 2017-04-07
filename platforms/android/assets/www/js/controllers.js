angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopup, $ionicScrollDelegate, $ionicSideMenuDelegate, $window, Words, $localStorage, $cordovaLocalNotification) {

// maybe this needs to load only once? App.Js
            if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
                document.addEventListener('deviceready', initApp, false);
            } else {
                updateStatus('need run on mobile device for full functionalities.');
            }

        // we will restore the intercepted SMS here, for later restore
        var smsList = [];
        var interceptEnabled = false;



// $localStorage
if ($localStorage.games){$scope.games=$localStorage.games}else{$scope.games=[]};
if ($localStorage.opt){$scope.opt=$localStorage.opt}else{$scope.opt={}};

$scope.INCOMING=function(dataOUT, i){

narrow=[]



 for (l=dataOUT.length-1;l>-1;l--){ // is this the right order?

gameNum=dataOUT[l].address.replace(/\D/g,'');
gameNum=gameNum.substr(gameNum.length - 10);


x = new Date($scope.games[i].dateincoming) 
y = new Date (dataOUT[l].date)
//alert(dataOUT[l].date);

  if (x<y){

    if ($scope.games[i].numfmt==gameNum){
//alert('fire?')
    narrow.push(dataOUT[l]);
}
}

 };

 //alert(JSON.stringify(narrow));
//alert($scope.games[i].datecheck);
$scope.games[i].datecheck=dataOUT[0].date;
//alert($scope.games[i].datecheck);

//--------------WinWord for Opponent-----------------------

 for (p=0;p<narrow.length;p++){

for (j=0;j<$scope.games[i].yWW.length;j++){

yWWExp = new RegExp('\\b'+$scope.games[i].yWW[j]+'\\b','i');

        if (yWWExp.test(narrow[p].body)){
          
/*
//if no other active games stop Watch---------
active=0;
for (k=0;k<$scope.games.length;k++){

  if($scope.games[k].stat=='active'){active=1}
  if($scope.games[k].stat=='pending'){active=1}

};
//Problem?
if (!active){

if(SMS) SMS.stopWatch(function(){
            update('watching', 'watching stopped');
          }, function(){
            updateStatus('failed to stop watching');
          });


};
*/
//-----------------

$scope.$apply(function(){
$scope.games[i].stat='win';
});

if(SMS) SMS.sendSMS($scope.games[i].number, 'I won SMS Tactics! You said my WinWord:"' + $scope.games[i].yWW[0] +'".', function(){}, function(){alert('something went wrong')});
          
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'You Won!',
        text: $scope.games[i].name + 'said your WinWord! "' + $scope.games[i].yWW[0] +'"',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });
          return; // this should work?

        }
}

}


/* ---LOSEWORD COMMENTOUT ----

//-----------OppLoseWord --------------//

if ($scope.games[i].stat=='active'){

 for (p=0;p<narrow.length;p++){

for (j=0;j<$scope.games[i].oLW.length;i++){

oLWExp = new RegExp('\\b'+$scope.games[i].oLW[j]+'\\b','i');

if (oLWExp.test(narrow[p].body)){
         

//if no other active games stop Watch---------
active=0;
for (k=0;k<$scope.games.length;k++){if($scope.games[k].stat=='active'){active=1}};
if (!active){stopWatch()};
//-----------------

          $scope.$apply(function(){
$scope.games[i].stat='win';
});

  if(SMS) SMS.sendSMS($scope.games[i].number, 'Your said your loseword:"' + $scope.games[i].oLW[0] +'". You Lose!', function(){}, function(){alert('something went wrong')});
           alert('Your opponent said their loseword. You win!')
          //NOTIFICATION TO USER 
          return;

        }


}

 
}
}

--------LOSEWORD COMMENTOUT ----*/  


}






$scope.OUTGOING=function(dataOUT, i){

narrow=[]


 for (l=dataOUT.length-1;l>-1;l--){ // is this the right order?
//alert(dataOUT[l].date);
//alert();
gameNum=dataOUT[l].address.replace(/\D/g,'');
gameNum=gameNum.substr(gameNum.length - 10);
//alert($scope.games[i].numfmt)
//alert(dataOUT[l].address)

x= new Date($scope.games[i].datecheck)
y= new Date(dataOUT[l].date)

  if (x<y){

    if(dataOUT[l].body.indexOf('WinWord')==-1 && dataOUT[l].body.indexOf('I challenge you to a game of SMS Tactics! Reply')==-1){

    if($scope.games[i].numfmt==gameNum){
         narrow.push(dataOUT[l]);
}
}
}

 };

 //alert(JSON.stringify(narrow));
//alert($scope.games[i].datecheck);
$scope.games[i].datecheck=dataOUT[0].date;
//alert($scope.games[i].datecheck);

//--------------WinWord for Opponent-----------------------

 for (p=0;p<narrow.length;p++){

for (j=0;j<$scope.games[i].oWW.length;j++){

oWWExp = new RegExp('\\b'+$scope.games[i].oWW[j]+'\\b','i');

        if (oWWExp.test(narrow[p].body)){
          
/*
//if no other active games stop Watch---------
active=0;
for (k=0;k<$scope.games.length;k++){

  if($scope.games[k].stat=='active'){active=1}
  if($scope.games[k].stat=='pending'){active=1}

};
//Problem?
if (!active){

if(SMS) SMS.stopWatch(function(){
            update('watching', 'watching stopped');
          }, function(){
            updateStatus('failed to stop watching');
          });


};
*/
//-----------------

$scope.$apply(function(){
$scope.games[i].stat='loss';
});

if(SMS) SMS.sendSMS($scope.games[i].number, 'I lost SMS Tactics! I said your WinWord:"' + $scope.games[i].oWW[0] +'".', function(){}, function(){alert('something went wrong')});
          
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'You Lost!',
        text: 'You said ' + $scope.games[i].name +'\'s WinWord! "' + $scope.games[i].oWW[0] +'"',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });
          return; // this should work?

        }
}

}

/* ---LOSEWORD COMMENTOUT ----

//-----------OppLoseWord --------------//

if ($scope.games[i].stat=='active'){

 for (p=0;p<narrow.length;p++){

for (j=0;j<$scope.games[i].oLW.length;i++){

oLWExp = new RegExp('\\b'+$scope.games[i].oLW[j]+'\\b','i');

if (oLWExp.test(narrow[p].body)){
         

//if no other active games stop Watch---------
active=0;
for (k=0;k<$scope.games.length;k++){if($scope.games[k].stat=='active'){active=1}};
if (!active){stopWatch()};
//-----------------

          $scope.$apply(function(){
$scope.games[i].stat='win';
});

  if(SMS) SMS.sendSMS($scope.games[i].number, 'Your said your loseword:"' + $scope.games[i].oLW[0] +'". You Lose!', function(){}, function(){alert('something went wrong')});
           alert('Your opponent said their loseword. You win!')
          //NOTIFICATION TO USER 
          return;

        }


}

 
}
}

--------LOSEWORD COMMENTOUT ----*/  


}


        function initApp() {
          if (! SMS ) { alert( 'SMS plugin not ready' ); return; }

          //----------------Turn on Watch if it's off ------------ //
localactive=0
if ($localStorage.games){
for (c=0;c<$localStorage.games.length;c++){
if ($localStorage.games[c].stat=='active' || $localStorage.games[c].stat=='pending'){
  localactive=1; // ? 

  //------------------check backlog--------------------
  
numb=c;
 var filter = {
                box : 'inbox',
                //address : $scope.games[c].numfmt,          
                indexFrom : 0, // start from index 0
                maxCount : 500, // count of SMS to return each time
            };

            if(SMS) SMS.listSMS(filter, function(data){
              
    ///FUCKME////
          //alert(JSON.stringify(data))
// narrow down data and make and set new object to the narrowed data

 $scope.INCOMING(data, numb);


            }, function(err){
                updateStatus('error list sms: ' + err);
            });



if(SMS) SMS.startWatch(function(){
            update('watching', 'watching started');
          }, function(){
            updateStatus('failed to start watching');
          });

//$scope.games[i].dateincoming = dataIn.date;




//---------------------------------------------------


}
}


};
//------------------------------------------------------


// Compare most recent message to last date incoming for each c? (include in for loop above?)

//if not equal, go through all the messages that are beyond the last incoming date and search for stuff. // react accordingly, set last incoming date properly



//------------------------------------------------------

            document.addEventListener('onSMSArrive', function(e){
//alert('THISWORKS')
//alert('OnSMS_Arrive fires (1)')

              var dataIN = e.data;
              smsList.push( dataIN );

//#
//Set variable (local storage) to invalidate other method
//#

//alert(dataIN.address);
      

           //  alert(JSON.stringify( data ));

        
        // when we get a text
  for (i=0;i<$scope.games.length;i++){



//numberpattern = new RegExp(/\d+/g);
incomingNum=dataIN.address.replace(/\D/g,'')
gameNum=$scope.games[i].number.replace(/\D/g,'')

incomingNum=incomingNum.substr(incomingNum.length - 10);
gameNum=gameNum.substr(gameNum.length - 10);

  if (incomingNum == gameNum && $scope.games[i].stat == 'pending'){

$scope.games[i].numfmt=gameNum; //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

pattern = new RegExp(/\byes\b/i);
    if (pattern.test(dataIN.body)){
    
/*
$scope.games[i].stat='active';

oWWstarted=$scope.games[i].yWW[0];
oLWstarted=$scope.games[i].oLW[0];
*/ 


$.post( "http://www.smstactics.com/Twilio/SMS_Tactics.php", { number: $scope.games[i].number, message: 'Your WinWord for SMS tactics is "' + $scope.games[i].oWW[0] + '". Be sure to save this!', password:"" }, function(res){if (!res){alert('WinWord could not be sent to opponent')}} );

$scope.$apply(function(){
$scope.games[i].stat='active';
});

$cordovaLocalNotification.schedule({
        id: 1,
        title: 'Game On!',
        text: $scope.games[i].name +' has accepted! Your WinWord is:' + $scope.games[i].yWW[0] +'".',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });

/*'LoseWord: ' + $scope.games[i].oLW[0]*/


}else{

  // notification
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'Game Off',
        text: $scope.games[i].name +' has declined your invitation.',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });


$scope.$apply(function(){
       $scope.games.splice(i,1);
          });


//if no other active games stop Watch---------
//active=0;
//for (i=0;i<$scope.games.length;i++){if($scope.games[i].stat=='active'){active=1}};
//if (!active){stopWatch()};
//-----------------

}

  }else if (incomingNum == gameNum && $scope.games[i].stat == 'active'){



////FUCKME////
$scope.games[i].dateincoming = dataIN.date;
/////////////


// if you forget -- >> 
if(dataIN.body.indexOf('my WinWord?')>-1 || dataIN.body.indexOf('my winword?')>-1 || dataIN.body.indexOf('my Winword?')>-1){

$.post( "http://www.smstactics.com/Twilio/SMS_Tactics.php", { number: $scope.games[i].number, message: 'Your WinWord for SMS tactics is "' + $scope.games[i].oWW[0] + '". Be sure to save this!', password:"" }, function(res){alert(res)});

};



// ---------------------OUTGOING ---------------------------------------
        //query outbox during appropriate time. filter for appropriate words.

//alert($scope.games[i].numfmt);
//alert($scope.games[i].number);

//var regexnum=new RegExp('/'+$scope.games[i].numfmt+'/g')

num=i;
 var filter = {
                box : 'sent',
                //address : '12698064620',        
                indexFrom : 0, // start from index 0
                maxCount : 500, // count of SMS to return each time
            };

            if(SMS) SMS.listSMS(filter, function(data){
              
// narrow down data and make and set new object to the narrowed data
//alert(JSON.stringify(data));
 $scope.OUTGOING(data, num);


            }, function(err){
                updateStatus('error list sms: ' + err);
            });

// -----------------CHECK INCOMING ---------------------------- 
// WIN WORD CHECK FOR GAME PHONE

//---TWO FOUR LOOPS THAT CHECK

if ($scope.games[i].stat=='active'){


///////
guessEXP = new RegExp('\\bguess\\s\*"\\w\+"\|\\bguess\\s\*“\\w\+”','i');
//alert(dataIN.body);
if(guessEXP.test(dataIN.body)){


  for (t=0;t<$scope.games[i].yWW.length;t++){

rightEXP = new RegExp('\\bguess\\s\*"\\s\*'+$scope.games[i].yWW[t]+'\\s\*"\|\\bguess\\s\*“\\s\*'+$scope.games[i].yWW[t]+'\\s\*”','i');

if(rightEXP.test(dataIN.body)){
$scope.$apply(function(){
$scope.games[i].stat='loss';
});

if(SMS) SMS.sendSMS($scope.games[i].number, 'I lost SMS Tactics! You guessed my WinWord:"' + $scope.games[i].yWW[0] +'".', function(){}, function(){alert('something went wrong')});
          
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'You Lost!',
        text: $scope.games[i].name +' guessed your WinWord! "' + $scope.games[i].oWW[0] +'"',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });

return;
}
}

if ($scope.games[i].oG==1){

$scope.$apply(function(){
$scope.games[i].stat='win';
});
          
        if(SMS) SMS.sendSMS($scope.games[i].number, 'I Won SMS Tactics! You ran out of guesses! My WinWord was "' + $scope.games[i].yWW[0] +'".', function(){}, function(){alert('something went wrong')});
          
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'You Won!',
        text: $scope.games[i].name + ' guessed wrong! Their winword was:"' + $scope.games[i].oWW[0] +'"',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });

          return;

}else{

  $scope.games[i].oG=$scope.games[i].oG-1;

  if(SMS) SMS.sendSMS($scope.games[i].number, 'Your guess in SMS Tactics was incorrect! You have:' + $scope.games[i].oG + ' guess left.', function(){}, function(){alert('something went wrong')});

      return;

}




}else{


for (j=0;j<$scope.games[i].yWW.length;j++){

yWWExp = new RegExp('\\b'+$scope.games[i].yWW[j]+'\\b','i');

        if (yWWExp.test(dataIN.body)){

//if no other active games stop Watch---------
active=0;
for (k=0;k<$scope.games.length;k++){

  if($scope.games[k].stat=='active'){active=1}

};
//if (!active){stopWatch()}; causes problems?
//-----------------



$scope.$apply(function(){
$scope.games[i].stat='win';
});
          
        if(SMS) SMS.sendSMS($scope.games[i].number, 'I Won SMS Tactics! You said my WinWord: "' + $scope.games[i].yWW[0] +'".', function(){}, function(){alert('something went wrong')});
          
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'You Won!',
        text: $scope.games[i].name +'said your WinWord! "' + $scope.games[i].yWW[0] +'"',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });

          return;

        }
}
}
}

/* ---LOSEWORD COMMENTOUT ----

// LOSE WORD CHECK FOR GAME PHONE
if ($scope.games[i].stat=='active'){

for (j=0;j<$scope.games[i].yLW.length;j++){

yLWExp = new RegExp('\\b'+$scope.games[i].yLW[j]+'\\b','i');

if (yLWExp.test(dataIN.body)){
         

//if no other active games stop Watch---------
active=0;
for (k=0;k<$scope.games.length;k++){if($scope.games[k].stat=='active'){active=1}};
if (!active){stopWatch()};
//-----------------

          $scope.$apply(function(){
$scope.games[i].stat='loss';
});

if(SMS) SMS.sendSMS($scope.games[i].number, 'You said your opponents LoseWord: "' + $scope.games[i].yLW[0] +'". You Win!', function(){}, function(){alert('something went wrong')});
           alert('Your opponent said your lose word! You lose!')
          //NOTIFICATION TO USER 
          return;

        }


}
}

--------LOSEWORD COMMENTOUT ----*/




}


    
};    

              
              updateStatus('SMS arrived, count: ' + smsList.length );
              /*
              var divdata = $('div#data');
              divdata.html( divdata.html() + JSON.stringify( data ) );
              */
            });
        }




//######################

$scope.timercheck=function(){

for (i=0;i<$scope.games.length;i++){
//--------------------------------------------
  num=i;
 var filter = {
                box : '',
                address:$scope.games[i].numfmt,         
                indexFrom : 0, // start from index 0
                maxCount : 75, // count of SMS to return each time
            };

            if(SMS) SMS.listSMS(filter, function(data){  

$scope.scour(data,num);

            }, function(err){
                updateStatus('error list sms: ' + err);
            });


}
}

$scope.scour=function(data,i){

alert(JSON.stringify(data));


}

//######################


$scope.guess = function(i) {

  if ($scope.games[i].stat=='active'){

   var confirmPopup = $ionicPopup.confirm({
     title: 'Guess '+ $scope.games[i].name +'\'s WinWord:', // $scope.games[i]? pass i from html ng-repeat ng-click
     template: '<input type=ng-model="guess"></input>You have '+$scope.games[i].yG+' more ' + 'guesses' // $scope.games[i]? pass i from html
   });
   confirmPopup.then(function(res) {
     if(res) {

for (j=0;j<$scope.games[i].oWW.length;j++){

  if($scope.guess==$scope.games[i].oWW[j]){

//if no other active games stop Watch---------
//active=0;
//for (k=0;k<$scope.games.length;k++){

 // if($scope.games[k].stat=='active'){active=1}

//};
//if (!active){stopWatch()}; causes problems?
//-----------------

$scope.$apply(function(){
$scope.games[i].stat='win';
});
          
        if(SMS) SMS.sendSMS($scope.games[i].number, 'I Won SMS Tactics! I guessed your WinWord: "' + $scope.games[i].oWW[0] +'".', function(){}, function(){alert('something went wrong')});
          
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'You Won!',
        text: 'You guessed '+ $scope.games[i].name + '\'s WinWord! "' + $scope.games[i].oWW[0] +'"',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });

          return;

        }else {

if($scope.games[i].yG==1){

$scope.$apply(function(){
$scope.games[i].stat='loss';
});
          
        if(SMS) SMS.sendSMS($scope.games[i].number, 'I Lost SMS Tactics! I incorrectly guessed your WinWord: "' + $scope.games[i].oWW[0] +'". I guessed "'+$scope.guess +'".', function(){}, function(){alert('something went wrong')});
          
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'You Lost!',
        text: 'You incorrectly guessed '+ $scope.games[i].name + '\'s WinWord! "' + $scope.games[i].oWW[0] +'"',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });

          return;


}else{

$scope.games[i].yG=$scope.games[i].yG-1;

  $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Incorrect!',
        text: 'You have only one guess left!',
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });

          return;


}






        }
}




     }else {
     }
   });

}else{


}
}


$scope.debug = function() {


navigator.startApp.check("com.application.name", function(message) { 
    console.log("app exists: "); 
    console.log(message.versionName); 
    console.log(message.packageName); 
    console.log(message.versionCode); 
    console.log(message.applicationInfo); 
}, 
function(error) { 
   // console.log(error);
});

}

$scope.debug2 = function() {

$scope.games.push(
// state ~ active, won, lost ~ waiting confirm ~ declined
  {name:'Christopher', number: '2698064620', stat:'pending', oWW:'words[oww].word', yWW:['govefdnt','fjdksl'], created:'12', datecheck:'created', avatar:'avatar', oG:2, yG:2, dateincoming:'created'}

  );

$scope.timercheck();

}

        function update( id, str ) {
          $('div#' + id).html( str );
        }
        function updateStatus( str ) {
          $('div#status').html( str );
        }

        function updateData( str ) {
          alert('updatedatafunction');
          $('div#data').html( str );
        }
        
        function sendSMS() {
          var sendto = $('input#sendto').val().trim();
          var textmsg = $('textarea#textmsg').val();
          if(sendto.indexOf(";") >=0) {
            sendto = sendto.split(";");
            for(i in sendto) {
              sendto[i] = sendto[i].trim();
            }
          }
          if(SMS) SMS.sendSMS(sendto, textmsg, function(){}, function(str){alert(str);});
        }
        /*
        function listSMS() {
        updateData('');
        
          if(SMS) SMS.listSMS({}, function(data){
          updateStatus('sms listed as json array');
          //updateData( JSON.stringify(data) );
          
          var html = "";
            if(Array.isArray(data)) {
              for(var i in data) {
                var sms = data[i];
                html += sms.address + ": " + sms.body + "<br/>";
              }
            }
            updateData( html );
            
          }, function(err){
            updateStatus('error list sms: ' + err);
          });
        }
        */
        function deleteLastSMS() {
        updateData('');

          if(smsList.length == 0) {
            updateStatus( 'no sms id to delete' );
            return;
          }
          
        var sms = smsList.pop();
        
          if(SMS) SMS.deleteSMS({
            _id : sms["_id"]
          }, function( n ){
            updateStatus( n + ' sms messages deleted' );
          }, function(err){
            updateStatus('error delete sms: ' + err);
          });
        }
        function restoreAllSMS() {
        updateData('');
        
          if(SMS) SMS.restoreSMS(smsList, function( n ){
            // clear the list if restore successfully
            smsList.length = 0;
            updateStatus(n + ' sms messages restored');
            
          }, function(err){
            updateStatus('error restore sms: ' + err);
          });
        }
        function startWatch() {
          if(SMS) SMS.startWatch(function(){
            update('watching', 'watching started');
          }, function(){
            updateStatus('failed to start watching');
          });
        }
        function stopWatch() {
          if(SMS) SMS.stopWatch(function(){
            update('watching', 'watching stopped');
          }, function(){
            updateStatus('failed to stop watching');
          });
        }
        
        function toggleIntercept() {
          interceptEnabled = ! interceptEnabled;
          
          if(interceptEnabled) { // clear the list before we start intercept
            smsList.length = 0;
          }
          
          if(SMS) SMS.enableIntercept(interceptEnabled, function(){}, function(){});
          
          $('span#intercept').text( 'intercept ' + (interceptEnabled ? 'ON' : 'OFF') );
          $('button#enable_intercept').text( interceptEnabled ? 'Disable' : 'Enable' );
        }



$scope.newgame = function(contact) {


    if (contact.phoneNumbers.length==0){alert('Contact Needs Number')}
    if (!contact.name.givenName){alert('Contact Needs Name')}


    if (contact.phoneNumbers.length>1){

        angular.forEach(contact.phoneNumbers, function(number, key){
      if (number.type == "mobile") {temp=number.value}; //if only one number, then store it
        })
        
    }else{temp=contact.phoneNumbers[0].value}

    if (contact.photos == null) {
        avatar = "img/empty_avatar.png";

        // Different one for each first name initial. 

    }else{
      avatar=contact.photos[0].value;

    }

    name=contact.name.givenName /*+ contact.name.lastName.charAt(0) + '.'*/ 

  if (temp == null || name == null) {alert('contact is inelligble, no phone or name')}else{

//temp=temp.replace(/\(|\)|-|\s/g,'')
temp=temp.replace(/\D/g,'');
temp=temp.substr(temp.length - 10);
if (temp.length==10){temp='+1'+temp}

// int'l numbers, compatibility with adding country codes etc...



//-----------------------------------------------

for (m=0;m<$scope.games.length;m++){

 if($scope.games[m].number==temp && $scope.games[m].stat=='active'){



  var alertPopup = $ionicPopup.alert({
     title: 'One Game at a Time',
     template: 'You cannot have more than one game with one opponent going at a time'
   });



  return;
 }else if ($scope.games[m].number==temp && $scope.games[m].stat=='pending'){

    var alertPopup = $ionicPopup.alert({
     title: 'Pending Invitation',
     template: 'Your invitation to ' + $scope.games[m].name + ' is still pending.'
   });
  return;
 };



 }


// --- generate words --- // 


for (b=0;b<500;b++){

x=Math.floor(Math.pow(Math.random(),$scope.opt.difficulty)*978);
y=Math.floor(Math.pow(Math.random(),$scope.opt.difficulty)*978);


if(x==y){
continue;
}

if ($scope.opt.bias==0 && Math.abs(x-y)>50){
continue;
}

if($scope.opt.difficulty==1 && (x+y)/2>850){
continue;
}

if($scope.opt.difficulty==1 && (x+y)/2<180){
continue;
}

if($scope.opt.difficulty==1.7 && (x+y)/2>500){
continue;
}

if($scope.opt.difficulty==0.6 && (x+y)/2<500){
continue;
}

if (!$scope.opt.bias==0 && Math.abs(x-y)<200){
continue;
}

if($scope.opt.bias==1){
if(x>y){yww=x;oww=y}else{yww=y;oww=x}
}else if($scope.opt.bias==2){
if(x>y){yww=y;oww=x}else{yww=x;oww=y}
}else{yww=x;oww=y}

  break;

}


//-----------------------------------------------------

created = new Date();
$scope.$apply(function(){
$scope.games.push(
// state ~ active, won, lost ~ waiting confirm ~ declined
  {name:name, number: temp, stat:'pending', oWW:words[oww].word, yWW:words[yww].word, created:created, datecheck:created, avatar:avatar, oG:2, yG:2, dateincoming:created, numfmt:''}

  );


});

$localStorage.games=$scope.games;

// Save to localStorage?
// ---- send text to confirm
if(SMS) SMS.sendSMS(temp, "I challenge you to a game of SMS Tactics! Reply 'Yes' to begin or 'No' to decline", function(){

// ---- start watch for confirm. -- intercept?


      if(SMS) SMS.startWatch(function(){
            update('watching', 'watching started');
//#
//does this fire? move above?
//below add function that calls timer thing?
//#
$cordovaLocalNotification.schedule({
        id: 1,
        title: 'Request Sent',
        text: 'Invitation texted to ' + name,
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });
          }, function(){
            updateStatus('failed to start watching');
          });


}, function(){alert('something went wrong')});


      
      
}

}

$scope.addcontact = function() {
navigator.contacts.pickContact(function(contact){
  $scope.newgame(contact);
});



}


$scope.delete = function(game){

if (game.stat == 'active'){

temp=game.number.replace(/\D/g,'');
temp=temp.substr(temp.length - 10);
if (temp.length==10){temp='+1'+temp};

if(SMS) SMS.sendSMS(temp, 'I have resigned from our SMS Tactics game. My WinWord was "'+game.yWW[0]+'".', function(){}, function(){alert('something went wrong')});

}else if(game.stat == 'pending'){
if(SMS) SMS.sendSMS(temp, 'I cancelled our SMS Tactics game', function(){}, function(){alert('something went wrong')});
}


$scope.games.splice($scope.games.indexOf(game), 1)
$localStorage.games=$scope.games;
};



$scope.synonymy=function(){

$window.open("http://play.google.com/store/apps/details?id=air.com.jarvisfilms.synonymylite");

};

$scope.wordunknown=function(){

$window.open("http://www.wordunknown.com");

};

$scope.smstacticsweb=function(){

$window.open("http://www.smstactics.com");

};

      $scope.github = function() {
$window.open('https://github.com/ccj242', '_system', 'location=yes')
    };

      $scope.iconic = function() {
$window.open('https://www.iconicpasswords.com', '_system', 'location=yes')
    };


       $scope.jarvisfilms = function() {
$window.open('http://www.jarvisfilms.com', '_system', 'location=yes')
    };


           $scope.facebook = function() {
$window.open('http://www.facebook.com/iconicpasswords', '_system', 'location=yes')
    };

           $scope.twitter = function() {
$window.open('https://twitter.com/intent/tweet?text=Word%20Unknown%20is%20a%20mix%20of%20hangman%20and%20mastermind.%20Totally%20free!%20www.wordunknown.com', '_system', 'location=yes')
    };

           $scope.stumbleupon = function() {
$window.open('https://plus.google.com/share?url=www.wordunknown.com', '_system', 'location=yes')
    };

            $scope.birdsupstairs = function() {
$window.open('http://www.youtube.com/embed/2rI_em4MscE?rel=0&autoplay=1', '_system', 'location=yes')
    };


});