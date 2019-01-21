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
		refined.push(element)}
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
		file = ["bA.md"]
		let tag:string[] = [];
		let category:string[] = [];

		//file contains bunch of really file url
		file.forEach(element => {
			readFile(require.resolve(dir+element)).then(buffer=>{
				snippetInsert(buffer.toString());
				let RawTag = buffer.toString().split("tags")[1].split("categories")[0].split("-")
				tag=concatList(RawTag,tag);
				// category.concat(buffer.toString().split("categories")[1].split("comments")[0].split("-"));
				vscode.window.showInformationMessage(tag.join(","));
				// vscode.window.showInformationMessage(category.join(","));

			});
		})
			

			// let buffer = readFile(require.resolve(dir+element)).then(()=>{
			// 	tag.concat(buffer.toString().split("tags")[1].split("categories")[0].split("-").splice(0,1));
			// 	category.concat(buffer.toString().split("categories")[1].split("comments")[0].split("-").splice(0,1));
			// 	vscode.window.showInformationMessage(tag.join(","));
			// 	vscode.window.showInformationMessage(category.join(","));

			// });

			// let RawTag=buffer.toString().split("tags")[1].split("categories")[0].split("-").splice(0,1)
			
			// tag.concat(RawTag)
			// category.concat(RawCategory)
			// vscode.window.showInformationMessage(content)
		
		

		// vscode.window.showInformationMessage(file[1]);
		// let file = ["Bs.md"]
		// vscode.window.showInformationMessage(file[0])
		//filter
		// for(let i in file){
		// 	if (i.indexOf("md")!==-1){
		// 		vscode.window.showInformationMessage("it contain md")
				// file.splice(file.indexOf(i),1,dir+i)
			// }
			// else if (i.includes("markdown")){
			// 	file.splice(file.indexOf(i),1,dir+i)
			// }
			// else{
			// 	file.splice(file.indexOf(i),1)
			// }
		// }; 
		// file = [dir+"bA.md"]
		
		// vscode.window.showInformationMessage(file[1]);
		// let buffer = await readFile(require.resolve(file[0]))
		// vscode.window.showInformationMessage(buffer.toString())


		// let buffer = await readFile(require.resolve('C:\\Users\\glze\\Documents\\blog\\hexo\\source\\_posts\\Ba.md'))
		// textEdit.insert(new vscode.Position(1,1),"absere");
		// vscode.window.showInformationMessage(buffer.toString());
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
