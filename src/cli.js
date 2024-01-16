import chalk from 'chalk';
import fs from 'fs';

import getExtracedFile from './index.js';
import validateLinkList from './http-validation.js';


const args = process.argv;

async function printList(validation, list, path = ''){
    if(validation) {
        console.log(
            chalk.black.bgYellow(`Valid links:`), 
            chalk.black.bgGreen(path),
            await validateLinkList(list));
    } else {
        console.log(
            chalk.black.bgYellow(`List of links:`), 
            chalk.black.bgGreen(path),
            list);

    }
}

async function textProcess(args) {
    const path = args[2];
    const validation = args[3] === '--validate' ? true : false;

    try {
        fs.lstatSync(path);
    } catch(erro){
        if(erro.code === 'ENOENT') {
            console.log(chalk.red(erro.code, 'File or diretory not found'));
            return
        }
    } 

    if(fs.lstatSync(path).isFile() === true) {
        const text = await getExtracedFile(path);
        printList(validation, text);
    } else if(fs.lstatSync(path).isDirectory() === true) {
        const files = await fs.promises.readdir(path);
        files.forEach(async file => {
            const text = await getExtracedFile(`${path}/${file}`);
            printList(validation, text, path);
        });
    }
}

textProcess(args);