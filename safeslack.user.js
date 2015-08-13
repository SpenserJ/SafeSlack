// ==UserScript==
// @name         Safe Slack
// @namespace    http://spenserj.com/
// @version      0.1.4
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

function lockSlack() {
  if (isLocked === true) { return; }
  isLocked = true;
  oldTitle = document.title;
  document.title = 'Down for maintenace';
  
  $('body').addClass('safeslack').addClass('cover-google');
  
  TS.generic_dialog.start({
    title: "Website is down for maintenance.",
    body: '<div class="logo"></div><br /><input type="text" id="safeslack_password">',
    show_cancel_button: false,
    show_go_button: true,
    go_button_text: "Google Search",
    esc_for_ok: false,
    fullscreen: true,
    enter_always_gos: true,
    on_go: function () {
      var password = $('#safeslack_password').val();
      if (password !== 'Spamsicey') {
        document.location.href = 'https://www.google.ca/webhp?hl=en#hl=en&q=' + password;
        return false;
      }
      document.title = oldTitle;
      isLocked = false;
    $('body').removeClass('safeslack').removeClass('cover-google');
      return true;
    },
    on_show: function () {
      var $password = $('#safeslack_password');
      $password.focus().blur(function () { setTimeout(function () { $password.focus(); }, 0); });
    },
  })
};

document.addEventListener("DOMContentLoaded", function(event) {
  var immediateLock = setInterval(function () {
    if (typeof TS.templates.fs_modal !== 'function') { return; }
    clearInterval(immediateLock);
    lockSlack();
  }, 50);

  var lastActivity = Date.now();
  var timedLock = setInterval(function () {
    if (lastActivity < (Date.now() - (slackMaxInactivity * 60 * 1000))) {
      lockSlack();
    }
  }, 1000);

  $('body')
    .mousemove(function () { lastActivity = Date.now(); })
    .keypress(function  () { lastActivity = Date.now(); });
});
