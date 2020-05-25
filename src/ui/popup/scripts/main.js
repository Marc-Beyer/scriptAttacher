
function createOpenOptionsMsg(){
    return {
        receiver: "background_browser_action",
        info: "openOptions"
    };
}

// Handle a click on optionsBtn
// Send a openOptions-msg to background_browser_action
function openOptionsHandler(){
    browser.runtime.sendMessage(createOpenOptionsMsg());
}

// Add Listener to optionsBtn
document.getElementById("optionsBtn").addEventListener('click', openOptionsHandler);

//todo test
openOptionsHandler();