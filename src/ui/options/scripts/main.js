// Html-elements
let urlSelect = document.getElementById("urlSelect");
let fileSelect = document.getElementById("fileSelect");
let fileTextArea = document.getElementById("fileTextArea");
let fileNameInput = document.getElementById("fileNameInput");
let fileTypeSelect = document.getElementById("fileTypeSelect");
let fileUrlsInput = document.getElementById("fileUrlsInput");
let fileSaveBtn = document.getElementById("fileSaveBtn");
let fileLable = document.getElementById("fileLable");
let urlsAddBtn = document.getElementById("urlsAddBtn");
let filesAddBtn = document.getElementById("filesAddBtn");
let loadingImg = document.getElementById("loadingImg");

// A tamplate for a new file
let defaultFile = {
    name: "new file",
    type: "js",
    urls: [".*"],
    file: "// Insert your code here //"
}

// All files loaded from storage
let files;
// All urls loaded from storage
let urls;
// The file currently show
let curFile;
// Bool that shows if the current file was edited
let curFileEdited = false;

// Returns a getFiles-msg
function createGetFilesMsg(){
    return {
        receiver: "background_storage",
        info: "getFiles"
    };
}

// Returns a fileEdited-msg
function createFileEditedMsg(oldFile, newFile){
    return {
        receiver: "background_storage",
        info: "fileEdited",
        oldFile: oldFile,
        newFile: newFile
    };
}

// Set the urls and updateUrlSelect
function setUrl(){
    urls = [];
    for (let file of files) {
        for (let url of file.urls) {
            if(!urls.includes(url)){
                urls.push(url);
            }
        }
    }
    updateUrlSelect();
}

// Get the files from background_storage and set file and urls
async function getFiles(){
    files = await browser.runtime.sendMessage(createGetFilesMsg());
    console.log("files", files);
    setUrl();
}

// Remove all children of the parent:element
function removeAllChilderen(parent){
    while(parent.childElementCount > 0){
        parent.children[0].remove();
    }
}

// Add an optionto a select-emement
function addOption(select, value, name){
    let option = document.createElement("option");
    option.value = value;
    if(name === undefined){
        option.append(document.createTextNode(value));
    }else{
        option.append(document.createTextNode(name));
    }
    select.append(option);
}

// Load all url into the urlSelect
function updateUrlSelect(){
    removeAllChilderen(urlSelect);
    removeAllChilderen(fileSelect);
    addOption(urlSelect, "<all files>", "All files");
    for (let url of urls) {
        addOption(urlSelect, url);
    }
}

// Get the selected url and get all relatet files and load them into the fileSelect
function updatefileSelect(url){
    removeAllChilderen(fileSelect);
    for (let file of files) {
        if(url === "<all files>"){
            addOption(fileSelect, file.name, "[" + file.type + "] " + file.name);
        }else{
            for (let fileUrl of file.urls) {
                if(fileUrl === url){
                    addOption(fileSelect, file.name, "[" + file.type + "] " + file.name);
                }
            }
        }
    }
}

// Get the selected file and load it into the fileTextArea and fileNameInput
function updateFileContainer(name){
    if(curFileEdited){
        // Check if there are unsafed changes and ask the user if he/she wants to continue
        let confirmed = confirm("You have unsaved changes! Do you still want to open a new file and loose all unsaved changes?")
        if(!confirmed){
            return;
        }
        curFileEdited = false;
    }

    if(name === undefined){
        fileNameInput.value = defaultFile.name;
        fileTypeSelect.value = defaultFile.type;
        if(defaultFile.urls.length > 0){
            fileUrlsInput.value = defaultFile.urls[0];
            for (let index = 1; index < defaultFile.urls.length; index++) {
                fileUrlsInput.value += " " + defaultFile.urls[index];
            }
        }else{
            fileUrlsInput.value = "";
        }
        fileTextArea.value = defaultFile.file;
        return;
    }

    for (let file of files) {
        if(file.name === name){
            setCurFile(file);
            fileNameInput.value = file.name;
            fileTypeSelect.value = file.type;
            if(file.urls.length > 0){
                fileUrlsInput.value = file.urls[0];
                for (let index = 1; index < file.urls.length; index++) {
                    fileUrlsInput.value += " " + file.urls[index];
                }
            }else{
                fileUrlsInput.value = "";
            }
            fileTextArea.value = file.file;
        }
    }
}

// Handle a change of urlSelect
// Update fileSelect
function urlSelectChangeHandler(event){
    updatefileSelect(event.explicitOriginalTarget.value);
}

// Handle a change of fileSelect
// Update fileTextArea, fileNameInput
function fileSelectChangeHandler(event){
    updateFileContainer(event.explicitOriginalTarget.value);
}

// Handle a change of fileTextArea, fileNameInput, fileTypeSelect, fileUrlsInput
function fileChangeHandler(event){
    curFileEdited = true;
    window.onbeforeunload = function() {
        return "You have unsaved changes! Do you still want leave the page?";
    };
}

// Get the new file
function getNewFile(){
    let newFile = {
        name: fileNameInput.value,
        type: fileTypeSelect.value,
        urls: fileUrlsInput.value.split(" "),
        file: fileTextArea.value
    }

    console.log("newFile", newFile);

    // Check if the name was changed, if true check if the name already exists
    if(curFile !== undefined && newFile.name === curFile.name){

    }else{
        for (let file of files) {
            if(newFile.name === file.name){
                return{error:"the name '" + newFile.name + "' already exists, please change it!"}
            }
        }
        if(newFile.name === ""){
            return{error:"the name has to be at least 1 character long!"}
        }
    }
    return newFile;
}

// Handle a click on fileSaveBtn
async function fileSaveBtnClickHandler(){
    loadingImg.style.display = "block";
    if(curFileEdited){
        let newFile = getNewFile();
        if(newFile.error !== undefined){
            alert(newFile.error);
        }else{
            curFileEdited = false;
            files = await browser.runtime.sendMessage(createFileEditedMsg(curFile, newFile));
            setUrl();
            setCurFile(newFile);
        }
    }
    loadingImg.style.display = "none";
}

// Set the curFile and the fileLable
function setCurFile(file){
    curFile = file;
    if(curFile === undefined){
        fileLable.innerText = "file selected: '' - this is a new file";
    }else{
        fileLable.innerText = "file selected: '" + curFile.name + "  [" + curFile.type + "]'";
    }
}

function fileTextAreaKeydownHandler(event){
    let keyCode = event.keyCode || event.which;

    if(keyCode === 9){
        event.preventDefault();
        let start = this.selectionStart;
        let end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionEnd = start + 1;
    }
}

function filesAddBtnClickHandler(){
    if(curFileEdited){
        let confirmed = confirm("You have unsaved changes! Do you still want to open a new file and loose all unsaved changes?")
        if(!confirmed){
            return;
        }
        curFileEdited = false;
    }
    
    setCurFile(undefined);
    updateFileContainer(undefined);
    curFileEdited = true;
}

// Add Listener
urlSelect.addEventListener("change", urlSelectChangeHandler);
fileSelect.addEventListener("change", fileSelectChangeHandler);
fileTextArea.addEventListener("change", fileChangeHandler);
fileNameInput.addEventListener("change", fileChangeHandler);
fileTypeSelect.addEventListener("change", fileChangeHandler);
fileUrlsInput.addEventListener("change", fileChangeHandler);
fileSaveBtn.addEventListener("click", fileSaveBtnClickHandler);

fileTextArea.addEventListener("keydown", fileTextAreaKeydownHandler);

filesAddBtn.addEventListener("click", filesAddBtnClickHandler);
urlsAddBtn.addEventListener("click", filesAddBtnClickHandler);

// Get the stored files from background_storage and update urlSelect
getFiles();