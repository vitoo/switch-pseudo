(function () {
    'use strict';

    console.log('Content script loaded');

    function getUsername() {
        const usernameElement = document.querySelector('span.headerAccount__pseudo');
        return usernameElement ? usernameElement.textContent : null;
    }

    function handleLogoutClick(event) {
        event.preventDefault();
        console.log('Déconnexion link clicked');
        chrome.runtime.sendMessage({ action: 'deleteCookie' }, () => {
            console.log('Cookie deletion message sent');
            location.reload();
          });
    }

    function deleteCookie(name, callback) {
        chrome.cookies.remove({
            url: 'https://www.jeuxvideo.com',
            name: name
        }, () => {
            console.log('Cookie removed successfully');
            if (callback) callback();
        });
    }

    const username = getUsername();
    if (username && username !== 'CONNEXION') {
        console.log(`Found username: ${username}`);
        chrome.runtime.sendMessage({ action: 'saveLoginCookie', username: username });
    } else {
        console.log('Username not found');
    }

    // Add event listener for Déconnexion link
    const logoutLink = document.querySelector('a[href*="https://www.jeuxvideo.com/sso/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogoutClick);
        console.log('Déconnexion link event listener added');
    } else {
        console.log('Déconnexion link not found');
    }
})();
