//register dialog elements
let loginDialog = document.querySelector("#login-dialog");
dialogPolyfill.registerDialog(loginDialog);
let registerDialog = document.querySelector("#register-dialog");
dialogPolyfill.registerDialog(registerDialog);

let closeLoginDialog = function() {
  loginDialog.close();
};

let showLoginDialog = function() {
  loginDialog.showModal();
};

let closeRegisterDialog = function() {
  registerDialog.close();
};

let showRegisterDialog = function() {
  registerDialog.showModal();
};

let showAnonymous = function() {
  document.getElementsByClassName("login")[0].style.display = "inline";
  document.getElementsByClassName("login")[1].style.display = "inline";
  document.getElementsByClassName("register")[0].style.display = "inline";
  document.getElementsByClassName("register")[1].style.display = "inline";
  document.getElementsByClassName("logout")[0].style.display = "none";
  document.getElementsByClassName("logout")[1].style.display = "none";
};

let showLoggedIn = function() {
  document.getElementsByClassName("login")[0].style.display = "none";
  document.getElementsByClassName("login")[1].style.display = "none";
  document.getElementsByClassName("register")[0].style.display = "none";
  document.getElementsByClassName("register")[1].style.display = "none";
  document.getElementsByClassName("logout")[0].style.display = "inline";
  document.getElementsByClassName("logout")[1].style.display = "inline";
};

let login = function() {
  let username = document.querySelector("#login-username").value;
  let password = document.querySelector("#login-password").value;

  hoodie.account
    .signIn({
      username: username,
      password: password
    })
    .then(function() {
      showLoggedIn();
      closeLoginDialog();

      let snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "You logged in"
      });
    })
    .catch(function(error) {
      console.log(error);
      document.querySelector("#login-error").innerHTML = error.message;
    });
};

let register = function() {
  let username = document.querySelector("#register-username").value;
  let password = document.querySelector("#register-password").value;
  let options = { username: username, password: password };

  hoodie.account
    .signUp(options)
    .then(function(account) {
      return hoodie.account.signIn(options);
    })
    .then(account => {
      showLoggedIn();
      closeRegisterDialog();
      return account;
    })
    .catch(function(error) {
      console.log(error);
      document.querySelector("#register-error").innerHTML = error.message;
    });
};

let signOut = function() {
  hoodie.account
    .signOut()
    .then(function() {
      showAnonymous();
      let snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "You logged out"
      });
      location.href = location.origin;//trigger a page refresh
    })
    .catch(function() {
      let snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Could not logout"
      });
    });
};
let updateDOMWithLoginStatus = () => {
  hoodie.account.get("session").then(function(session) {
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
};

export {
  register,
  login,
  signOut,
  updateDOMWithLoginStatus,
  showRegisterDialog,
  closeRegisterDialog,
  showLoginDialog,
  closeLoginDialog,
  showLoggedIn,
  showAnonymous
};
