
var selectedFile = null;
var navigation = $('#nav-main').okayNav();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    var emailVerified = user.emailVerified;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
      
    
    firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
      //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        document.getElementById("userMobile").innerText =  snapshot.val().mobile;
        document.getElementById("userAge").innerText = snapshot.val().age;
        document.getElementById("userGender").innerText = snapshot.val().gender;      
    });
    
    var providerData = user.providerData;
    document.getElementById("CurrentStatus").innerText = "Profile";
    document.getElementById("CurrentUser").innerText = user.displayName;
    document.getElementById("UserProfileImage").src =  user.photoURL;
    document.getElementById("userEmail").innerText = user.email;
    if(!emailVerified){
      $(".nav").toggleClass("nav-up");
      $(".form-signin").toggleClass("form-signin-down");
      $(".form-signup-left").toggleClass("form-signup-down");
      $(".success").toggleClass("success-left");
      $(".forgot").toggleClass("forgot-fade"); 
      $(".btn-confirmation-email").toggleClass("btn-confirmation-email-up");
      $(".btn-logout").toggleClass("btn-logout-down");
      $(".frame").toggleClass("frame-short");
    }
    else{
      $(".btn-animate").toggleClass("btn-animate-grow");
      $(".welcome").toggleClass("welcome-left");
      $(".cover-photo").toggleClass("cover-photo-down");
      $(".profile-photo").toggleClass("profile-photo-down");
      $(".btn-edit-profile").toggleClass("btn-edit-profile-up");
      $(".btn-logout").toggleClass("btn-logout-up");
      $(".forgot");
    }
    if(emailVerified)
        document.getElementById("message").innerText = "Welcome, "+user.displayName;
    document.getElementById('btn-ok').innerText = "Close";
    document.getElementById('btn-ok').onclick = function(){ document.getElementById("myModal").style.display = "none"; };
    document.getElementById('btn-ok').style.display = "block";
    // ...
  } else {

  }
});

$(function() {
    
    $(document).on('click', '.Card_Layout > .Discription_Layout > .productCard_rightSide > .block_specification',function () {
        var buttonSpecification = $(this).children(".block_specification__specificationShow");
        var buttonInformation = $(this).children(".block_specification__informationShow");
        var X = $(this).parent(".productCard_rightSide").children(".block_product").children(".block_informationAboutDevice");
        var blockCharacteristiic = X.children(".block_descriptionCharacteristic");
        if (buttonSpecification.hasClass('hide')) {
            buttonSpecification.removeClass('hide');
            buttonInformation.addClass('hide');
            blockCharacteristiic.removeClass('block_descriptionCharacteristic__active');
        } else {
            buttonSpecification.addClass('hide');
            buttonInformation.removeClass('hide');
            blockCharacteristiic.addClass('block_descriptionCharacteristic__active');
        }
    });
    
    $(document).on('click', '.Card_Layout > .Discription_Layout > .productCard_rightSide > .block_product > .block_informationAboutDevice > .button',function () {
        alert("Payment Gatway is not Done Yet..");
//        alert($(this).children('.block_name__mainName').innerHTML); 
    });
    
    
	$(".btn").click(function() {
		$(".form-signin").toggleClass("form-signin-left");
        $(".form-signup").toggleClass("form-signup-left");
        $(".frame").toggleClass("frame-long");
        $(".signup-inactive").toggleClass("signup-active");
        $(".signin-active").toggleClass("signin-inactive");
        $(".forgot").toggleClass("forgot-left");   
        $(this).removeClass("idle").addClass("active");
	});
	$(".btn-back").click(function() {
        $(".welcome").toggleClass("welcome-left");
        $(".profile-photo").toggleClass("profile-photo-down");
        $(".Editwelcome").toggleClass("Editwelcome-left");
        $(".Editprofile-photo").toggleClass("Editprofile-photo-down");
        $(".btn-save-profile").toggleClass("btn-save-profile-up");
        $(".btn-back").toggleClass("btn-back-up");
        $(".btn-edit-profile").toggleClass("btn-edit-profile-up");
        $(".btn-logout").toggleClass("btn-logout-up");
	});
    
	$(".btn-edit-profile").click(function() {
        $(".welcome").toggleClass("welcome-left");
        $(".profile-photo").toggleClass("profile-photo-down");
        $(".btn-edit-profile").toggleClass("btn-edit-profile-up");
        $(".btn-logout").toggleClass("btn-logout-up");
        $(".Editwelcome").toggleClass("Editwelcome-left");
        $(".Editprofile-photo").toggleClass("Editprofile-photo-down");
        $(".btn-save-profile").toggleClass("btn-save-profile-up");
        $(".btn-back").toggleClass("btn-back-up");
        document.getElementById("current-user-name").value = document.getElementById("CurrentUser").innerText;
        document.getElementById("SetProfile").src =  document.getElementById("UserProfileImage").src;
        document.getElementById("current-user-mobile").value =  document.getElementById("userMobile").innerText;
        document.getElementById("current-user-age").value = document.getElementById("userAge").innerText ;
        document.getElementById("current-user-gender").value = document.getElementById("userGender").innerText;
	});
    
	$(".btn-save-profile").click(function() {
        document.getElementById("myModal").style.display = "block";
        update_profile();
	});

  $(".btn-signup").click(function() {
    document.getElementById("myModal").style.display = "block";
    document.getElementById("message").innerText = "Loading...";
    document.getElementById('btn-ok').style.display = "none";
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      // Create user with email and pass.
      // [START createwithemail]
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
            sendEmailVerification();  
            var user = firebase.auth().currentUser;
              firebase.database().ref('users/' + user.uid).set({
                mobile : document.getElementById('mobile').value,
                age : document.getElementById('age').value,
                gender : "Male"
              });
          
            user.updateProfile({
              displayName: document.getElementById('fullname').value,
              photoURL: "https://image.flaticon.com/icons/png/512/64/64572.png"
            }).then(function() {
              // Update successful.
            }).catch(function(error) {
              // An error happened.
            });                                               
        }).catch(function(error) {
          
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
          document.getElementById("myModal").style.display = "none";
        // [END_EXCLUDE]
      });
	});

  $(".btn-confirmation-email").click(function() {
    document.getElementById('btn-ok').style.display = "none";
    document.getElementById("myModal").style.display = "block";
    document.getElementById("message").innerText = "Sending Email...";
    sendEmailVerification();
    document.getElementById('btn-ok').innerText = "Close";
    document.getElementById('btn-ok').onclick = function(){ document.getElementById("myModal").style.display = "none"; };
    
  });
    
  $(".btn-signin").click(function() {
    document.getElementById("myModal").style.display = "block";
    document.getElementById("message").innerText = "Loading...";
    document.getElementById('btn-ok').style.display = "none";
    var userEmail = document.getElementById("username").value;
    var userPass = document.getElementById("login_password").value;
    if (firebase.auth().currentUser)
      firebase.auth().signOut();
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function () {
        
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

        document.getElementById("message").innerText = "Error : " + errorMessage;
        document.getElementById('btn-ok').innerText = "OK";
      document.getElementById('btn-ok').style.display = "block";
      // ...
    });
  });

  $(".close-button").click(function(){
      if($('.btn-reset-password').css('opacity') == 1){
        $(".btn-animate").toggleClass("btn-animate-grow");
        $(".input-box").toggleClass("input-box-down");
        $(".text-fild").toggleClass("text-fild-down");
        $(".btn-reset-password").toggleClass("btn-reset-password-up");
        $(".forgot").toggleClass("forgot-fade");
        $(".frame").toggleClass("frame-v-short");
      }
      else
        document.getElementById("LoginSignup").style.display = "none";
      if($('.btn-back').css('opacity') == 1){
        $(".welcome").toggleClass("welcome-left");
        $(".profile-photo").toggleClass("profile-photo-down");
        $(".Editwelcome").toggleClass("Editwelcome-left");
        $(".Editprofile-photo").toggleClass("Editprofile-photo-down");
        $(".btn-save-profile").toggleClass("btn-save-profile-up");
        $(".btn-back").toggleClass("btn-back-up");
        $(".btn-edit-profile").toggleClass("btn-edit-profile-up");
        $(".btn-logout").toggleClass("btn-logout-up");
      }      
  });
  $(".close-model").click(function(){
      document.getElementById("myModal").style.display = "none";
  });
  $(".myImg").click(function(){
      document.getElementById("myModalimage").style.display = "block";
      document.getElementById("img01").src = document.getElementById("UserProfileImage").src ;
  });
  $(".closeimage").click(function(){
      document.getElementById("myModalimage").style.display = "none";
  });
  $(".forgot").click(function(){
    $(".btn-animate").toggleClass("btn-animate-grow");
    $(".frame").toggleClass("frame-v-short");
    $(".input-box").toggleClass("input-box-down");
    $(".text-fild").toggleClass("text-fild-down");
    $(".btn-reset-password").toggleClass("btn-reset-password-up");
    $(".forgot").toggleClass("forgot-fade");
  })
});

function sendEmailVerification() {
  // [START sendemailverification]    
  firebase.auth().currentUser.sendEmailVerification().then(function() {
      document.getElementById("message").innerText = "Email Verification Sent!";
      document.getElementById('btn-ok').style.display = "block";
  });
  // [END sendemailverification]
}

var loadFile = function(event) {
    var image = document.getElementById("SetProfile");
    image.src = URL.createObjectURL(event.target.files[0]);
    selectedFile = event.target.files[0];
};

function update_profile() {
    var user = firebase.auth().currentUser;
    
    if(selectedFile!=null){
        var storageRef = firebase.storage().ref('/Profile/'+user.uid);
        var uploadTask = storageRef.put(selectedFile);
        uploadTask.on('state_changed', function(snapshot){

        }, function(error) {
            document.getElementById("message").innerText = "Uploding Faild";
            document.getElementById('btn-ok').style.display = "block";
            // Handle unsuccessful uploads
        }, function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                firebase.database().ref('users/' + user.uid).set({
                    mobile : document.getElementById('current-user-mobile').value,
                    age : document.getElementById('current-user-age').value,
                    gender : document.getElementById('current-user-gender').value
                });
                user.updateProfile({
                displayName: document.getElementById('current-user-name').value,
                photoURL: downloadURL
                }).then(function() {
                    document.getElementById("message").innerText = "Uploding Done !";
                    document.getElementById('btn-ok').style.display = "block";
                //  Update successful.
                }).catch(function(error) {
                    alert(error);
                });

            });
        });
    }
    else{
        var user = firebase.auth().currentUser;
        firebase.database().ref('users/' + user.uid).set({
            mobile : document.getElementById('current-user-mobile').value,
            age : document.getElementById('current-user-age').value,
            gender : document.getElementById('current-user-gender').value
        });
        user.updateProfile({
        displayName: document.getElementById('current-user-name').value,
        photoURL: user.photoURL
        }).then(function() {
            document.getElementById("message").innerText = "Uploding Done !";
            document.getElementById('btn-ok').style.display = "block";
        // Update successful.
        }).catch(function(error) {
            alert(error);
        });
    }
}

function sendPasswordReset() {
  var email = document.getElementById('reset_email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}

document.getElementById("LoginSignupForm").addEventListener('click', function() {
  document.getElementById("LoginSignup").style.display = "block";
}, false);

window.onclick = function(event) {
  if (event.target == document.getElementById("LoginSignup")) {
      if($('.btn-reset-password').css('opacity') == 1){
        $(".btn-animate").toggleClass("btn-animate-grow");
        $(".input-box").toggleClass("input-box-down");
        $(".text-fild").toggleClass("text-fild-down");
        $(".btn-reset-password").toggleClass("btn-reset-password-up");
        $(".forgot").toggleClass("forgot-fade");
        $(".frame").toggleClass("frame-v-short");
      }
      else
        document.getElementById("LoginSignup").style.display = "none";
      if($('.btn-back').css('opacity') == 1){
        $(".welcome").toggleClass("welcome-left");
        $(".profile-photo").toggleClass("profile-photo-down");
        $(".Editwelcome").toggleClass("Editwelcome-left");
        $(".Editprofile-photo").toggleClass("Editprofile-photo-down");
        $(".btn-save-profile").toggleClass("btn-save-profile-up");
        $(".btn-back").toggleClass("btn-back-up");
        $(".btn-edit-profile").toggleClass("btn-edit-profile-up");
        $(".btn-logout").toggleClass("btn-logout-up");
      }
  }
};

$('input').focus(function(){
  $(this).parents('.form-group').addClass('focused');
});

$('input').blur(function(){
  var inputValue = $(this).val();
  if ( inputValue == "" ) {
    $(this).removeClass('filled');
    $(this).parents('.form-group').removeClass('focused');  
  } else {
    $(this).addClass('filled');
  }
})  


$('input').focus(function(){
  $(this).parents('.Input-Box-Group').addClass('focused-Box-Group');
});

$('input').blur(function(){
  var inputValue = $(this).val();
  if ( inputValue == "" ) {
    $(this).removeClass('filled');
    $(this).parents('.Input-Box-Group').removeClass('focused-Box-Group');  
  } else {
    $(this).addClass('filled');
  }
})  

function logout(){
  firebase.auth().signOut();
  location.reload();
}

// TOGGLE HAMBURGER & COLLAPSE NAV
$('.nav-toggle').on('click', function() {
  $(this).toggleClass('open');
  $('.menu-left').toggleClass('collapse');
});

$('.fab').on('click',function(){
  $('.ChatBoxHide').toggleClass('ChatBoxShow');
  $('.fab-img').toggleClass('fab-img-close');
  $('.MyChatBootHide').toggleClass('MyChatBootShow');
})
$('.MyChatBootHide').on('click',function(){
  $('.ChatBoxHide').toggleClass('ChatBoxShow');
  $('.fab-img').toggleClass('fab-img-close');
  $('.MyChatBootHide').toggleClass('MyChatBootShow');
})