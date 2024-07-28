(function () {
    'use strict';

    function getUsername() {
        const usernameElement = document.querySelector('span.headerAccount__pseudo');       
        return (usernameElement && usernameElement.textContent !== 'CONNEXION') ? usernameElement.textContent : null;
    }

    const username = getUsername();
    if (username) {
        chrome.runtime.sendMessage({ action: 'saveLoginCookie', username: username });
    } 

    function handleLogoutClick(event) {
        event.preventDefault();
        chrome.runtime.sendMessage({ action: 'deleteLoginCookie' }, () => {
            location.reload();
          });
    }

    const logoutLink = document.querySelector('a[href*="https://www.jeuxvideo.com/sso/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogoutClick);
    } 
    
})();
