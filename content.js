(function () {
    'use strict';

    function getUsername() {
        const usernameElement = document.querySelector('span.headerAccount__pseudo');
        return usernameElement ? usernameElement.textContent : null;
    }

    function handleLogoutClick(event) {
        event.preventDefault();
        chrome.runtime.sendMessage({ action: 'deleteCookie' }, () => {
            location.reload();
          });
    }

    function deleteCookie(name, callback) {
        chrome.cookies.remove({
            url: 'https://www.jeuxvideo.com',
            name: name
        }, () => {
            // console.log('Cookie removed successfully');
            if (callback) callback();
        });
    }

    const username = getUsername();
    if (username && username !== 'CONNEXION') {
        chrome.runtime.sendMessage({ action: 'saveLoginCookie', username: username });
    } 

    // Add event listener for Déconnexion link
    const logoutLink = document.querySelector('a[href*="https://www.jeuxvideo.com/sso/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogoutClick);
    } 
})();
