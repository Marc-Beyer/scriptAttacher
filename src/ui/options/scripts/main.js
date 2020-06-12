// Html-elements
let urlSelect = document.getElementById("urlSelect");
let fileSelect = document.getElementById("fileSelect");
let fileTextArea = document.getElementById("fileTextArea");
let fileNameInput = document.getElementById("fileNameInput");
let fileTypeSelect = document.getElementById("fileTypeSelect");
let fileUrlsInput = document.getElementById("fileUrlsInput");
let fileSaveBtn = document.getElementById("fileSaveBtn");
let fileLableSpan = document.getElementById("fileLableSpan");
let urlsAddBtn = document.getElementById("urlsAddBtn");
let filesAddBtn = document.getElementById("filesAddBtn");
let loadingImg = document.getElementById("loadingImg");
let importBtn = document.getElementById("importBtn");
let exportBtn = document.getElementById("exportBtn");
let fileLoaderBtn = document.getElementById("fileLoaderBtn");
let fileDeleteBtn = document.getElementById("fileDeleteBtn");
let fileUpBtn = document.getElementById("fileUpBtn");
let fileDownBtn = document.getElementById("fileDownBtn");
let fileEnableDisablenBtn = document.getElementById("fileEnableDisablenBtn");

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

// Returns a filesLoaded-msg
function createFilesLoadedMsg(newFiles){
    return {
        receiver: "background_storage",
        info: "filesLoaded",
        newFiles: newFiles
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
    setUrl();
}

// Remove all children of the parent:element
function removeAllChilderen(parent){
    while(parent.childElementCount > 0){
        parent.children[0].remove();
    }
}

// Add an optionto a select-emement
function addOption(select, value, name, isEnabled = true){
    let option = document.createElement("option");
    option.value = value;
    if(name === undefined){
        if(isEnabled){
            option.append(document.createTextNode(value));
        }else{
            option.append(document.createTextNode("[DISABLED] " + value));
        }
    }else{
        if(isEnabled){
            option.append(document.createTextNode(name));
        }else{
            option.append(document.createTextNode("[DISABLED] " + name));
        }
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
    urlSelect.value = "<all files>";
    updatefileSelect(urlSelect.value);
}

// Get the selected url and get all relatet files and load them into the fileSelect
function updatefileSelect(url){
    removeAllChilderen(fileSelect);
    for (let file of files) {
        if(url === "<all files>"){
            addOption(fileSelect, file.name, "[" + file.type + "] " + file.name, file.isEnabled);
        }else{
            for (let fileUrl of file.urls) {
                if(fileUrl === url){
                    addOption(fileSelect, file.name, "[" + file.type + "] " + file.name, file.isEnabled);
                }
            }
        }
    }
    if(curFile !== undefined){
        fileSelect.value = curFile.name;
    }
}

// Get the selected file and load it into the fileTextArea and fileNameInput
function updateFileContainer(name){
    if(curFileEdited){
        // Check if there are unsafed changes and ask the user if he/she wants to continue
        let confirmed = confirm("You have unsaved changes! Do you still want to open a new file and loose all unsaved changes?")
        if(!confirmed){
            // Update selection
            updatefileSelect(urlSelect.value);
            return;
        }
        curFileEdited = false;
    }
 
    //todo not nice
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
    }else if(name === null){
        fileNameInput.value = "";
        fileTypeSelect.value = defaultFile.type;
        fileUrlsInput.value = "";
        fileTextArea.value = "";
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
        isEnabled: fileEnableDisablenBtn.value === "true",
        type: fileTypeSelect.value,
        urls: fileUrlsInput.value.split(" "),
        file: fileTextArea.value
    }

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
            setCurFile(newFile);
            setUrl();
        }
    }
    loadingImg.style.display = "none";
}

// Set the curFile and the fileLableSpan
function setCurFile(file){
    curFile = file;
    if(curFile === undefined){
        fileLableSpan.innerText = "file selected: '' is enabled. - this is a new file";
        fileEnableDisablenBtn.value = true;
        fileEnableDisablenBtn.textContent = "disable";
    }else{
        fileLableSpan.innerText = "file selected: '" + curFile.name + "  [" + curFile.type + "]'";
        fileEnableDisablenBtn.value = curFile.isEnabled;
        if(curFile.isEnabled){
            fileEnableDisablenBtn.textContent = "disable";
            fileLableSpan.innerText += " is enabled.";
        }else{
            fileEnableDisablenBtn.textContent = "enable";
            fileLableSpan.innerText += " is disabled.";
        }
    }
}

// Handle a keypress while fileTextArea is focused
// Use tabs in fileTextArea 
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

// Handle a click on filesAddBtn
function filesAddBtnClickHandler(){
    // Check if unsaved changes exist and ask the user if he/she wants to continue
    if(curFileEdited){
        let confirmed = confirm("You have unsaved changes! Do you still want to open a new file and loose all unsaved changes?")
        if(!confirmed){
            // Update selection
            updatefileSelect(urlSelect.value);
            return;
        }
        curFileEdited = false;
    }
    
    setCurFile(undefined);
    updateFileContainer(undefined);
    curFileEdited = true;
    
    // Update selection
    urlSelect.value = "<all files>";
    updatefileSelect(urlSelect.value);
}

// Handle a click on importBtn
// Click the hidden fileLoaderBtn
function importBtnClickHandler(){
    fileLoaderBtn.click();
}

// Handle a click on exportBtn
async function exportBtnClickHandler(){
    download(JSON.stringify({files:files}, null, 2), "scriptAttacher-bka", "application/json");
}

// If file is Loaded 
async function onLoad(event) {
    let fileString = event.target.result;
    let jsonFiles = JSON.parse(fileString);

    // Check if filenames already exist
    let duplicatedFileNames = [];
    for (let file of files) {
        for (let importedFile of jsonFiles.files) {
            if(file.name === importedFile.name){
                duplicatedFileNames.push(importedFile.name);
            }
        }
    }
    // Ask user if he/she wants to override duplicated filenames
    if(duplicatedFileNames.length > 0){
        let duplicatedFileNamesString = "";
        for (let filename of duplicatedFileNames) {
            duplicatedFileNamesString += "\n" + filename;
        }
        let confirmed = confirm(duplicatedFileNames.length + " file name(s) already exist! If you continue they/it will be overritten!\nDuplicated filename(s):" + duplicatedFileNamesString);
        if(!confirmed){
            loadingImg.style.display = "none";
            return;
        }
    }
    // Remove all files with same names
    for (let filename of duplicatedFileNames) {
        for (let index = 0; index < files.length; index++) {
            if(filename === files[index].name){
                files.splice(index, 1);
            }
            
        }
    }
    // Concat
    files = files.concat(jsonFiles.files);

    files = await browser.runtime.sendMessage(createFilesLoadedMsg(files));
    setUrl();
    loadingImg.style.display = "none";
}

// Get the choosen file and read it as text
function startRead(event) {
    loadingImg.style.display = "block";
    let file = fileLoaderBtn.files[0];
    if (file) {
        let fileReader = new FileReader();

        fileReader.readAsText(file, "UTF-8");

        fileReader.onload = onLoad;
    }
}

// Handle the click on fileDeleteBtn
async function fileDeleteBtnClickHandler(){
    loadingImg.style.display = "block";
    files = await browser.runtime.sendMessage(createFileEditedMsg(curFile, undefined));
    curFile = undefined;
    updateFileContainer(null);
    setCurFile();
    setUrl();
    loadingImg.style.display = "none";
}

// Handle the click on fileEnableDisablenBtn
function fileEnableDisablenBtnClickHandler(){
    if(fileEnableDisablenBtn.value === "true"){
        fileEnableDisablenBtn.value = "false";
        fileEnableDisablenBtn.textContent = "enable";
    }else if(fileEnableDisablenBtn.value === "false"){
        fileEnableDisablenBtn.value = "true";
        fileEnableDisablenBtn.textContent = "disable";
    }
    curFileEdited = true;
}

// Move file
async function moveFileHandler(indexShift){
    loadingImg.style.display = "block";

    // Get the index of the curFile
    index = -1;
    // Check if a curFile exists
    if(curFile === undefined){
        loadingImg.style.display = "none";
        return;
    }
    for (let i = 0; i < files.length; i++) {
        if(files[i].name === curFile.name){
            index = i;
        }
    }
    // Could not find the curFile in files
    if(index === -1){
        loadingImg.style.display = "none";
        return;
    }

    // Move file
    files.splice(index, 1);
    indexShift = index + indexShift;
    if(indexShift < 0){
        indexShift = 0;
    }else if(indexShift > files.length){
        indexShift = files.length;
    }
    files.splice(indexShift, 0, curFile);

    // Send to update backround
    files = await browser.runtime.sendMessage(createFilesLoadedMsg(files));
    setUrl();
    loadingImg.style.display = "none";
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
fileDeleteBtn.addEventListener("click", fileDeleteBtnClickHandler);
fileUpBtn.addEventListener("click", (event) => {moveFileHandler(-1)});
fileDownBtn.addEventListener("click", (event) => {moveFileHandler(1)});
importBtn.addEventListener("click", importBtnClickHandler);
exportBtn.addEventListener("click", exportBtnClickHandler);
fileEnableDisablenBtn.addEventListener("click", fileEnableDisablenBtnClickHandler);

if (window.File && window.FileReader && window.FileList && window.Blob) {
    //The file-APIs are supported.
    fileLoaderBtn.addEventListener('change', startRead, false);
}

// Get the stored files from background_storage and update urlSelect
getFiles();