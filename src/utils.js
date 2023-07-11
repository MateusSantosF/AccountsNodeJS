const chalk = require('chalk')
const fs = require('fs')


const SUCCESS = chalk.bgGreen.black;
const ERROR = chalk.bgRed.black;
const WARNING = chalk.bgYellow.black;
const INFO = chalk.bgGray.white;


module.exports = {

    info(message){
        console.log(INFO(formatMessage(message)));   
    },
    warning(message){
        console.log(WARNING(formatMessage(message)));
    },
    error(message){
        console.log(ERROR(formatMessage(message)))
    },
    success(message){
        console.log(SUCCESS(formatMessage(message)))
    },
    createWithNotExistsBaseDir(){
        if(!fs.existsSync(process.env.BASE_PATH)){
            fs.mkdirSync(process.env.BASE_PATH);
        }
    },
    formatToBRL(value){

        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })
    }
}

function formatMessage(message){
    return `\n\n${message}\n\n`;
}