// ==UserScript==
// @name         Safe Slack
// @namespace    http://spenserj.com/
// @version      0.1.6
// @description  Lock Slack when the session has been idle
// @author       Spenser Jones <hello@spenserj.com>
// @match        https://spamsle.slack.com/*
// @grant        none
// @downloadUrl  https://rawgit.com/SpenserJ/SafeSlack/master/safeslack.user.js
// @updateUrl    https://rawgit.com/SpenserJ/SafeSlack/master/safeslack.user.js
// @run-at       document-start
// ==/UserScript==

// How many minutes can you be inactive in Slack before it locks?
var slackMaxInactivity = 5;

// Don't edit anything below this line.

var oldTitle = '';
var isLocked = false;
var head = document.getElementsByTagName('head')[0];

function newStylesheet(src) {
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = src;
  style.sfw = 'true';
  head.appendChild(style);
}

newStylesheet('https://rawgit.com/SpenserJ/SafeSlack/master/dist/css/style.css');

var $overlay;
var $password;
function initializeOverlay() {
  var $form = $('<form>');
  $password = $('<input type="text" id="safeslack_password">');
  $form.append('<div class="logo">');
  $form.append($password);
  $form.append('<div class="actions"><input type="submit" value="Google Search"><input type="submit" value="I\'m Feeling Lucky"></div>');

  $form.submit(function (e) {
    e.preventDefault();
    var password = $password.val();
    $password.val('');
    if (password !== 'Spamsicey') {
      document.location.href = 'https://www.google.ca/webhp?hl=en#hl=en&q=' + password;
      return false;
    }
    document.title = oldTitle;
    isLocked = false;
    $('body').removeClass('safeslack').removeClass('cover-google');
    $overlay.hide();
  });

  $overlay = $('<div id="safeslack-overlay">').append($form).hide().appendTo('body');
}

function lockSlack() {
  if (isLocked === true) { return; }
  isLocked = true;
  oldTitle = document.title;
  document.title = 'Google';
  
  $('body').addClass('safeslack').addClass('cover-google');
  
  $overlay.show();
  $password.focus().blur(function () { setTimeout(function () { $password.focus(); }, 0); });
};

document.addEventListener("DOMContentLoaded", function(event) {
  initializeOverlay();
  lockSlack();

  var lastActivity = Date.now();
  var timedLock = setInterval(function () {
    if (lastActivity < (Date.now() - (slackMaxInactivity * 60 * 1000))) {
      lockSlack();
    }
  }, 1000);

  $(window).blur(lockSlack);

  $('body')
    .mousemove(function () { lastActivity = Date.now(); })
    .keypress(function  () { lastActivity = Date.now(); });
});
