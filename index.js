require('dotenv').config({path:'.env'});
const inquirer = require('inquirer').createPromptModule();
const chalk = require('chalk')
const fs = require('fs')
const accountController = require('./src/accountController');
const utils = require('./src/utils');

const ACTION_KEY = 'action'

function start(){
    inquirer([{
        type:'list',
        name: ACTION_KEY,
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }]).then((answer)=>{
        const action = answer[ACTION_KEY]

        switch(action){
            case "Criar Conta":
                accountController.create(start)
                break;
            case "Consultar Saldo":
                accountController.checkExistsAccount(start, accountController.getBalance)
                break;
            case "Depositar":
                accountController.checkExistsAccount(start, accountController.deposit)
                    break;
            case "Sacar":
                accountController.checkExistsAccount(start, accountController.withdraw)
                break;
            case "Sair":
                utils.info("Obrigado por escolher a gente. Até breve.")
                break;
        }
    }).catch(_=>{

    })
}

utils.createWithNotExistsBaseDir()
start()