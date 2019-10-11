"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var loginDialog, registerDialog, closeLoginDialog, showLoginDialog, closeRegisterDialog, showRegisterDialog, showAnonymous, showLoggedIn, login, register, signOut, updateDOMWithLoginStatus;
  return {
    setters: [],
    execute: function () {
      loginDialog = document.querySelector("#login-dialog");

      dialogPolyfill.registerDialog(loginDialog);
      registerDialog = document.querySelector("#register-dialog");

      dialogPolyfill.registerDialog(registerDialog);

      _export("closeLoginDialog", closeLoginDialog = function closeLoginDialog() {
        loginDialog.close();
      });

      _export("showLoginDialog", showLoginDialog = function showLoginDialog() {
        loginDialog.showModal();
      });

      _export("closeRegisterDialog", closeRegisterDialog = function closeRegisterDialog() {
        registerDialog.close();
      });

      _export("showRegisterDialog", showRegisterDialog = function showRegisterDialog() {
        registerDialog.showModal();
      });

      _export("showAnonymous", showAnonymous = function showAnonymous() {
        document.getElementsByClassName("login")[0].style.display = "inline";
        document.getElementsByClassName("login")[1].style.display = "inline";
        document.getElementsByClassName("register")[0].style.display = "inline";
        document.getElementsByClassName("register")[1].style.display = "inline";
        document.getElementsByClassName("logout")[0].style.display = "none";
        document.getElementsByClassName("logout")[1].style.display = "none";
      });

      _export("showLoggedIn", showLoggedIn = function showLoggedIn() {
        document.getElementsByClassName("login")[0].style.display = "none";
        document.getElementsByClassName("login")[1].style.display = "none";
        document.getElementsByClassName("register")[0].style.display = "none";
        document.getElementsByClassName("register")[1].style.display = "none";
        document.getElementsByClassName("logout")[0].style.display = "inline";
        document.getElementsByClassName("logout")[1].style.display = "inline";
      });

      _export("login", login = function login() {
        var username = document.querySelector("#login-username").value;
        var password = document.querySelector("#login-password").value;

        hoodie.account.signIn({
          username: username,
          password: password
        }).then(function () {
          showLoggedIn();
          closeLoginDialog();

          var snackbarContainer = document.querySelector("#toast");
          snackbarContainer.MaterialSnackbar.showSnackbar({
            message: "You logged in"
          });
        }).catch(function (error) {
          console.log(error);
          document.querySelector("#login-error").innerHTML = error.message;
        });
      });

      _export("register", register = function register() {
        var username = document.querySelector("#register-username").value;
        var password = document.querySelector("#register-password").value;
        var options = { username: username, password: password };

        hoodie.account.signUp(options).then(function (account) {
          return hoodie.account.signIn(options);
        }).then(function (account) {
          showLoggedIn();
          closeRegisterDialog();
          return account;
        }).catch(function (error) {
          console.log(error);
          document.querySelector("#register-error").innerHTML = error.message;
        });
      });

      _export("signOut", signOut = function signOut() {
        hoodie.account.signOut().then(function () {
          showAnonymous();
          var snackbarContainer = document.querySelector("#toast");
          snackbarContainer.MaterialSnackbar.showSnackbar({
            message: "You logged out"
          });
          location.href = location.origin; //trigger a page refresh
        }).catch(function () {
          var snackbarContainer = document.querySelector("#toast");
          snackbarContainer.MaterialSnackbar.showSnackbar({
            message: "Could not logout"
          });
        });
      });

      _export("updateDOMWithLoginStatus", updateDOMWithLoginStatus = function updateDOMWithLoginStatus() {
        hoodie.account.get("session").then(function (session) {
          if (!session) {
            // user is signed out
            showAnonymous();
          } else if (session.invalid) {
            // user has signed in, but session has expired
            showAnonymous();
          } else {
            // user is signed in
            showLoggedIn();
          }
        });
      });

      _export("register", register);

      _export("login", login);

      _export("signOut", signOut);

      _export("updateDOMWithLoginStatus", updateDOMWithLoginStatus);

      _export("showRegisterDialog", showRegisterDialog);

      _export("closeRegisterDialog", closeRegisterDialog);

      _export("showLoginDialog", showLoginDialog);

      _export("closeLoginDialog", closeLoginDialog);

      _export("showLoggedIn", showLoggedIn);

      _export("showAnonymous", showAnonymous);
    }
  };
});