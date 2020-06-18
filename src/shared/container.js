// A tamplate for a new file
let defaultFile = {
    name: "new file",
    isEnabled: false,
    type: "js",
    urls: ["^https*://www.example.com/*.*$"],
    file: "// Insert your code here //"
}

//defaultStorage is set when the the add-on is installed
const defaultStorage = {"files": [
  {
    "name": "netflixVolume",
    "isEnabled": false,
    "type": "script-link",
    "urls": [
      "^https*://www.netflix.com/*.*$"
    ],
    "file": "https://marc-beyer.github.io/scriptAttacher/example%20scripts/netflixVolume.js"
  },
  {
    "name": "Titillium Web Font",
    "isEnabled": false,
    "type": "other",
    "urls": [
      ".*"
    ],
    "file": "{\n\t\"_comment\":\"The 'other'-type has to be in json-format. all keys are attributes added to the node, exept 'tagName' and 'text'. 'tagName ' is the name of the node and 'text' the text appended as textnode\",\n\t\"tagName\":\"link\",\n\t\"href\":\"https://fonts.googleapis.com/css?family=Titillium+Web\",\n\t\"rel\":\"stylesheet\",\n\t\"text\":\"\"\n}"
  },
  {
    "name": "dark google design",
    "isEnabled": false,
    "type": "css",
    "urls": [
      "^https*://www.google.de/*.*$",
      "^https*://www.google.com/*.*$"
    ],
    "file": "body, .RNNXgb, .gNO89b, .RNmpXc, .aajZCb, .fbar, #hdtbSum, .sfbg, .nojsv, .GHDvEf{\n\tbackground: #181a1b !important;\n\tcolor: #dcd9d4 !important;\n}\n\n.sbhl{\n\tfont-family: 'Titillium Web' !important;\n\tbackground: #2a2e31 !important;\n\tcolor: #dcd9d4 !important;\n}\n\n.minidiv .sfbg{\n\tborder-bottom: 1px solid #333333!important;\n}\n\nspan, input{\n\tcolor: #dcd9d4 !important;\n}\n\na, .iUh30, .fl{\n\tcolor: #3e80ff !important;\n}\n\n.RNNXgb, .gNO89b, .RNmpXc, #fbar, .fbar, .b2hzT, #hdtb, .xtSCL{\n\tborder-color: #333333 !important;\n}\n.RNNXgb:hover{\n\tborder-color: #333333!important;\n}\n\ndiv, h1, h2, h3, h4, span, input, a, li{\n\tfont-family: 'Titillium Web' !important;\n}"
  },
  {
    "name": "hello google",
    "isEnabled": false,
    "type": "js",
    "urls": [
      "^https*://www.google.com/*.*$"
    ],
    "file": "console.log(\"Hello google!\");"
  }
]}