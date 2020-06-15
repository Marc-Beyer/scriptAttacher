// All files stored
let files;

// Creates a AddFileMsg and return it
function createAddFilesMsg(addFiles){
    return {
        receiver: "content_controller",
        info: "addFiles",
        addFiles: addFiles
    };
}


// Creates a EditedFileMsg and return it
function createEditedFileMsg(editedFile){
    return {
        receiver: "content_controller",
        info: "editedFile",
        editedFile: editedFile
    };
}

// Get all files that match the url
function getFilesWithUrl(url){
    let matchingFiles = [];
    for (let file of files) {
        for (let fileUrl of file.urls) {
            if(url.match(fileUrl)){
                matchingFiles.push(file);
            }
        }
    }
    return matchingFiles;
}

// Handle the onUpdated-event
async function handleTabUpdate(tabId, changeInfo, tabInfo) {
    if(changeInfo.status === "complete"){

        console.log(`Updated tab: ${tabId} with url ${tabInfo.url}`);

        // Send a msg to the content_controller with the files to add if there are files to add
        let addFiles = getFilesWithUrl(tabInfo.url);
        if(addFiles.length > 0){
            try {
                browser.tabs.sendMessage(tabId, createAddFilesMsg(addFiles));
            } catch (error) {
                // ERR
            }
        }
    }
}

// Set the defaultStorage if the add-on is installed the first time
browser.runtime.onInstalled.addListener(details => {
    if(details.reason === "install"){
        browser.storage.local.set(defaultStorage);
    }
});

// Get the storage
function getStorage(){
    browser.storage.local.get(data => {
        files = data.files;

        // Remove old Listener
        if(browser.tabs.onUpdated.hasListener(handleTabUpdate)){
            browser.tabs.onUpdated.removeListener(handleTabUpdate);
        }

        // Listen for tab updates, that match filter.urls
        browser.tabs.onUpdated.addListener(handleTabUpdate);
    });
}

// If the storage has changed invoke getStorage() and update files 
browser.storage.onChanged.addListener(getStorage);

// Listen for msgs
browser.runtime.onMessage.addListener((msg, sender) => {
    if(msg.receiver !== "background_storage"){
        return;
    }

    // Request all files
    if(msg.info === "getFiles"){
        return new Promise((resolve) => {
            resolve(files);
        });
    }

    // Edited one file. Get the edited file and set it to the storage
    if(msg.info === "fileEdited"){
        // if msg.oldFile is undefined msg.newFile is a completely new file
        if(msg.oldFile === undefined){
            if(msg.newFile !== undefined){
                files.push(msg.newFile);
            }
        }else{
            // Search the edited file(msg.oldFile) in files and replace it with msg.newFile
            for (let file of files) {
                if(file.name === msg.oldFile.name){
                    if(msg.newFile === undefined){
                        files.splice(files.indexOf(file), 1);
                    }else{
                        files[files.indexOf(file)] = msg.newFile;
                    }
                }
            }
        }

        // Upadte all tabs
        let querying = browser.tabs.query({});
        querying.then((tabs)=>{
            for(let tab of tabs){
                if(tab.url !== undefined){
                    if(msg.newFile === undefined){
                        if(msg.oldFile !== undefined){
                            browser.tabs.sendMessage(tab.id, createEditedFileMsg({name: msg.oldFile.name, isEnabled: false}));
                        }
                    }else{
                        let matchesUrl = false;
                        for (let url of msg.newFile.urls) {
                            if(tab.url.match(url)){
                                matchesUrl = true;
                            }
                        }
                        if(matchesUrl){
                            if(msg.oldFile !== undefined && msg.newFile.name !== msg.oldFile.name){
                                browser.tabs.sendMessage(tab.id, createEditedFileMsg({name: msg.oldFile.name, isEnabled: false}));
                            }
                            browser.tabs.sendMessage(tab.id, createEditedFileMsg(msg.newFile));
                        }
                    }
                }
            }
        });
        
        // Set the edited files to the sorage
        browser.storage.local.set({files:files});
        return new Promise((resolve) => {
            resolve(files);
        });
    }

    // Replace all FIles with msg.newFiles and set it to the storage
    if(msg.info === "filesLoaded"){
        files = msg.newFiles;
        browser.storage.local.set({files:files});
        return new Promise((resolve) => {
            resolve(files);
        });
    }
});

// Get the Storage at the start
getStorage();