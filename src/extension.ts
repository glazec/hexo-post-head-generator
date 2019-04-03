// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as util from "util";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const path = require("path");

// #region make the snippet
function createSnippet(snippet: string) {
  return new vscode.SnippetString(snippet);
}
//#endregion

// #region uniquelize the tag and category list
function uniquelize(raw: string[]) {
  return Array.from(new Set(raw));
}
// #endregion

function snippetInsert(snippet: string) {
  try {
    let editor = vscode.window.activeTextEditor;
    editor!.insertSnippet(createSnippet(snippet), new vscode.Position(1, 1));
  } catch (error) {
    vscode.window.showInformationMessage("Please open a file first");
  }
}

//region concat two list and uniquelize them
function smartConcatList(raw: string[], refined: string[]) {
  raw.forEach((element) => {
    if (!element.includes(":")) {
      let index = element.indexOf("\n");
      if (element.trim().substring(0, index - 2).length > 1) {
        refined.push(element.trim().substring(0, index - 1));
      }
    }
  });

  return uniquelize(refined);
}

//remember to put await for the funciton
//
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "hexo-post-head-generator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.initHexoHead", async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      //check for the url
      let dir: string = vscode.workspace
        .getConfiguration("initHexoHead")
        .get("postsPath")!
        .toString();
      let file = await readdir(dir);
      try {
        file.splice(file.indexOf(".vscode"), 1);
      } catch (error) {}
      // file = ["bA.md"]
      let tag: string[] = [];
      let category: string[] = [];

      //file contains bunch of really file url
      file.forEach((element) => {
        console.log("dir: " + dir);
        console.log("filename: " + element);
        readFile(require.resolve(path.join(dir, element))).then((buffer) => {
          tag = smartConcatList(
            buffer
              .toString()
              .split("tags")[1]
              .split("categories")[0]
              .split("-"),
            tag
          );
          category = smartConcatList(
            buffer
              .toString()
              .split("categories")[1]
              .split("comments")[0]
              .split("-"),
            category
          );
          if (file.indexOf(element) === file.length - 1) {
            let resultstring = `---%0Atitle%3A%20%20%24%7B1%3A%24TM_FILENAME_BASE%7D%0Atags%3A%0A-%20%24%7B2%7C${tag.join(
              ","
            )}%7C%7D%0Acategories%3A%0A-%20%24%7B3%7C${category.join(
              ","
            )}%7C%7D%0Acomment%3A%20true%0Adate%3A%20%24%7B4%3A%24CURRENT_YEAR-%24CURRENT_MONTH-%24CURRENT_DATE%7D%0A---%0A%24%7B5%3Aexcerpt%7D%0A%3C%21--%20more%20--%3E`;
            snippetInsert(unescape(resultstring));
          }
        });
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.hexoAudio", async () => {
      let audioDir: string = vscode.workspace
        .getConfiguration("initHexoHead")
        .get("audioPath")!
        .toString();
      let serverAudioPath: string = vscode.workspace
        .getConfiguration("initHexoHead")
        .get("serverAudioPath")!
        .toString();
      if (serverAudioPath.slice(-1) !== "/") {
        serverAudioPath = serverAudioPath + "/";
      }

      let audioFile = await readdir(audioDir);
      // try {
      //   audioFile.splice(audioFile.indexOf(".vscode"), 1);
      // } catch (error) {}
      let resultstring = `%7B%25%20aplayer%20%22%24%7B1%7C${audioFile.join(
        ","
      )}%7C%7D%22%20%22%24%7B2%3Aauthor%20name%7D%20%22${serverAudioPath}%24%7B1%7C${audioFile.join(
        ","
      )}%7C%7D%22%20%25%7D`;

      snippetInsert(unescape(resultstring));
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.hexoImage", async () => {
      let imageDir: string = vscode.workspace
        .getConfiguration("initHexoHead")
        .get("imagePath")!
        .toString();
      let serverImagePath: string = vscode.workspace
        .getConfiguration("initHexoHead")
        .get("serverImagePath")!
        .toString();
        if (serverImagePath.slice(-1) !== "/") {
          serverImagePath = serverImagePath + "/";
        }
      let html: string = vscode.workspace
        .getConfiguration("initHexoHead")
        .get("imageHtmlSetting")!
        .toString();
      let imageFile = await readdir(imageDir);
      // try {
      //   imageFile.splice(imageFile.indexOf(".vscode"), 1);
      // } catch (error) {}
      let resultstring = `%3Ccenter%3E%3Cimg%20src%3D%${serverImagePath}%24%7B1%3A%7C${imageFile.join(
        ","
      )}%7C%7D${html}%22%3E%3C/center%3E`;
      snippetInsert(resultstring);
    })
  );
  //   context.subscriptions.push([disposable, audio, image]);
  //   context.subscriptions.push(disposable);
  //   context.subscriptions.push(audio);
  //   context.subscriptions.push(image);
}

// this method is called when your extension is deactivated
export function deactivate() {}
