
function saveLoginCookie(username) {
    console.log(`Saving login cookie for username: ${username}`);
    chrome.cookies.get({ url: 'https://www.jeuxvideo.com', name: 'coniunctio' }, (cookie) => {
        if (cookie) {
            console.log(`Cookie value: ${cookie.value}`);
            chrome.storage.local.get({ loginCookies: {} }, (result) => {
                const storedData = result.loginCookies;
                storedData[username] = cookie.value;
                chrome.storage.local.set({ loginCookies: storedData });
                console.log(`Cookie saved for username: ${username}`);
            });
        } else {
            console.log('No cookie found');
        }
    });
}

function deleteLoginCookie(callback) {
    chrome.cookies.remove({ url: 'https://www.jeuxvideo.com', name: 'coniunctio' }, () => {
      console.log('Cookie removed successfully');
      if (callback) callback();
    });
  }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveLoginCookie') {
        saveLoginCookie(message.username);
    } else if (message.action === 'deleteCookie') {
        console.log('Received message to delete cookie');
        deleteLoginCookie(() => {
            sendResponse({ status: 'Cookie deleted' });
        });
        return true; // Indicates that sendResponse will be called asynchronously
    }
});

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.startsWith('https://www.jeuxvideo.com/')) {
        injectContentScript(details.tabId);
    }
}, { url: [{ hostContains: 'jeuxvideo.com' }] });

function injectContentScript(tabId) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
            }, () => {
                console.log('Content script injected');
            });
        }
    });
}
