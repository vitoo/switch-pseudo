document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get({ loginCookies: {} }, (result) => {
      const storedData = result.loginCookies;
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';
  
      Object.keys(storedData).forEach(username => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-item');
  
        const userLabel = document.createElement('span');
        userLabel.textContent = username;
        userDiv.appendChild(userLabel);
  
        const switchButton = document.createElement('button');
        switchButton.textContent = 'S';
        switchButton.onclick = () => {
          setCookie('coniunctio', storedData[username]);
          refreshCurrentTab();
        };
        userDiv.appendChild(switchButton);
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'D';
        deleteButton.style='margin-left: 5px';
        deleteButton.onclick = () => {
            if (!confirm(`Are you sure you want to delete the cookie for ${username}?`)) {
              return;
            }
            delete storedData[username];
            chrome.storage.local.set({ loginCookies: storedData }, () => {
              userDiv.remove();
            });
        };
        userDiv.appendChild(deleteButton);
  
        userList.appendChild(userDiv);
      });
    });
  });
  
  function setCookie(name, value) {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 2);
  
    chrome.cookies.set({
      url: 'https://www.jeuxvideo.com',
      name: name,
      value: value,
      domain: '.www.jeuxvideo.com',
      path: '/',
      httpOnly: true,
      expirationDate: expirationDate.getTime() / 1000
    }, () => {
    });
  }
  
  function refreshCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.startsWith('https://www.jeuxvideo.com/')) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }