let debug = document.getElementById("debug");
let attachedScriptsContainer = document.getElementById("attachedScriptsContainer");

// The tab url where the popup was opend
let currentTabUrl;

let files;

let attachedScript_template = document.getElementById("attachedScript_template");

function createIsEnabledChangedMsg(oldFile, newFile){
    return {
        receiver: "background_storage",
        info: "fileEdited",
        oldFile: oldFile,
        newFile: newFile
    };
}

function createOpenOptionsMsg(){
    return {
        receiver: "background_browser_action",
        info: "openOptions"
    };
}

// Returns a getFiles-msg
function createGetFilesMsg(){
    return {
        receiver: "background_storage",
        info: "getFiles"
    };
}

// Get an EventHandler for attachedScriptChbxs
function getAttachedScriptChbxChangeHandler(id, oldFile){
    return ()=>{
        debug.innerText += id + " changed to " + document.getElementById(id).checked + "\n";
        let newFile = oldFile;
        newFile.isEnabled = document.getElementById(id).checked;
        browser.runtime.sendMessage(createIsEnabledChangedMsg(oldFile, newFile));
    }
}

// Fill the attachedScriptsContainer with files
function fillScriptContainer(){
    // Get the template
    let attachedScript_template = document.getElementById("attachedScript_template");

    for (let file of files) {
        for (let fileUrl of file.urls) {
            if(currentTabUrl.match(fileUrl)){
                // Clone
                let attachedScript = attachedScript_template.cloneNode(true);

                // Modify
                attachedScript.id = "attachedScript_" + file.name;
                let children = attachedScript.children;
                children[0].id = "attachedScriptChbx_" + file.name;
                children[0].checked = file.isEnabled;
                children[0].addEventListener("change", getAttachedScriptChbxChangeHandler(children[0].id, file));
                children[1].id = "attachedScriptSpan_" + file.name;
                children[1].innerText = "[" + file.type + "] " + file.name;

                // Append
                attachedScriptsContainer.append(attachedScript);
                break;
            }
        }
    }

    // Remove the template
    attachedScript_template.remove();
}

// Handle a click on optionsBtn
// Send a openOptions-msg to background_browser_action
function openOptionsHandler(){
    browser.runtime.sendMessage(createOpenOptionsMsg());
}

// Add Listener to optionsBtn
document.getElementById("optionsBtn").addEventListener('click', openOptionsHandler);


// Init
async function init(){
    let currentTabs = await browser.tabs.query({active: true, currentWindow: true});
    currentTabUrl = currentTabs[0].url;
    files = await browser.runtime.sendMessage(createGetFilesMsg());

    fillScriptContainer();

    //openOptionsHandler();
    debug.innerText += currentTabUrl + "\n";
}

init();