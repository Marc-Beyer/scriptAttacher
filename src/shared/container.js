// A tamplate for a new file
let defaultFile = {
    name: "new file",
    isEnabled: false,
    type: "js",
    urls: [".*"],
    file: "// Insert your code here //"
}

//defaultStorage is set when the the add-on is installed
const defaultStorage = {files:[
    {
        name: "jquery 3.5.1",
        isEnabled: false,
        type: "script-link",
        urls: [".*"],
        file: "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
    },
    {
        name: "random backgroundColor with jquery",
        isEnabled: false,
        type: "js",
        urls: [".*"],
        file: 
`function getRandomColor() {
\tlet r = Math.floor(Math.random() * 256);
\tlet g = Math.floor(Math.random() * 256);
\tlet b = Math.floor(Math.random() * 256);
\tlet letters = '0123456789ABCDEF';
\tlet color = \`rgb(\${r},\${g},\${b})\`;
\tconsole.log("color", color);
\treturn color;
}

let waitForJQuery = setInterval(function () {
\tif (typeof $ != 'undefined') {
\t\t$('body,html').css({'background-color': getRandomColor()});
\tclearInterval(waitForJQuery);
\t}
}, 10);`
    },
    {
        name: "hello google",
        isEnabled: false,
        type: "js",
        urls: ["^https*:\/\/www\.google\.de\/*.*$", "^https*:\/\/www\.google\.com\/*.*$"],
        file: "console.log(\"Hello google!\");"
    },
    {
        name: "hello google 2",
        isEnabled: false,
        type: "js",
        urls: ["^https*:\/\/www\.google\.de\/*.*$", "^https*:\/\/www\.google\.com\/*.*$", "^https*:\/\/www\.google\..*$"],
        file: "console.log(\"Hello again!\");"
    },
    {
        name: "nice google layout",
        isEnabled: false,
        type: "css",
        urls: ["^https*:\/\/www\.google\.com\/*$"],
        file: 
`#hplogo{
\ttransform: rotate(20deg) translate(-200px, -100px);
}

#tsf{
\ttransform: rotate(-20deg);
}

#main{
\ttransform: rotate(20deg) translate(100px, 100px);
}
`

    },
    {
        name: "Titillium Web Font",
        isEnabled: false,
        type: "other",
        urls: [".*"],
        file: "{\n\t\"_comment\":\"The 'other'-type has to be in json-format. all keys are attributes added to the node, exept 'tagName' and 'text'. 'tagName ' is the name of the node and 'text' the text appended as textnode\",\n\t\"tagName\":\"link\",\n\t\"href\":\"https://fonts.googleapis.com/css?family=Titillium+Web\",\n\t\"rel\":\"stylesheet\",\n\t\"text\":\"\"\n}"
    }
    
]}
