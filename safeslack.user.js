// ==UserScript==
// @name         Safe Slack
// @namespace    http://spenserj.com/
// @version      0.1.3
// @description  Lock Slack when the session has been idle
// @author       Spenser Jones <hello@spenserj.com>
// @match        https://spamsle.slack.com/*
// @grant        none
// @downloadUrl  http://labs.spenserj.com/joeys/safeslack.user.js
// @updateUrl    http://labs.spenserj.com/joeys/safeslack.user.js
// ==/UserScript==

// How many minutes can you be inactive in Slack before it locks?
var slackMaxInactivity = 5;

// Don't edit anything below this line.

var oldTitle = '';
var isLocked = false;

function lockSlack() {
  if (isLocked === true) { return; }
  isLocked = true;
  oldTitle = document.title;
  document.title = 'Down for maintenace';
  
  TS.generic_dialog.start({
    title: "Website is down for maintenance.",
    body: 'If you are the administrator, please enter your password here:<br /><strong id="safeslack_error" style="color: #d00000; padding: 12px 0; display: none;"></strong><input type="password" id="safeslack_password">',
    show_cancel_button: false,
    show_go_button: true,
    go_button_text: "Login",
    esc_for_ok: false,
    fullscreen: true,
    enter_always_gos: true,
    on_go: function () {
      var password = $('#safeslack_password').val();
      if (password !== 'Spamsicey') {
        $('#safeslack_error').text('That password is incorrect').clearQueue().slideDown().delay(5 * 1000).slideUp();
        return false;
      }
      document.title = oldTitle;
      isLocked = false;
      return true;
    },
    on_show: function () {
      var $password = $('#safeslack_password');
      $password.focus().blur(function () { setTimeout(function () { $password.focus(); }, 0); });
    },
  })
};

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
