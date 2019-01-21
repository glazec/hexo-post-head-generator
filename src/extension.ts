// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as util from 'util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const readFile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)

// make the snippet
function createSnippet(snippet:string){
	return new vscode.SnippetString(snippet)
}

function snippetInsert(snippet:string){
	try {
		vscode.window.activeTextEditor.insertSnippet(createSnippet(snippet),new vscode.Position(1,1));
	} catch (error) {
		vscode.window.showInformationMessage("Please open a file first")
	}
}

function concatList(raw:string[],refined:string[]){
	raw.forEach(element => {
		if(!element.includes(":")){
		refined.push(element)
		}
	});
	
	return refined
}

//remember to put await for the funciton
// 
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "hexo-post-head-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.addHexoSnippet',async (context) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		//check for the url
		let dir='C:\\Users\\glze\\Documents\\blog\\hexo\\source\\_posts\\'
		snippetInsert("concise version");
		
		let file =await readdir(dir);
		file.splice(file.indexOf(".vscode"),1)
		let tag:string[] = [];
		let category:string[] = [];

		//file contains bunch of really file url
		await file.forEach(element => {
			readFile(require.resolve(dir+element)).then(buffer=>{
				tag=concatList(buffer.toString().split("tags")[1].split("categories")[0].split("-"),tag);
				category=concatList(buffer.toString().split("categories")[1].split("comments")[0].split("-"),category)
			});
		});
		snippetInsert(tag.join(","))
		snippetInsert(category.join(","))


	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
