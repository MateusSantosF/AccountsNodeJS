const inquirer = require('inquirer').createPromptModule();
const utils = require('./utils')
const fs = require('fs')

const ACTION_KEY = 'accountOwner'
const WITHDRAW_KEY = 'withdrawValue'
const DEPOSIT_KEY = 'depositValue'

module.exports = {
    create(backToMenu) {
        inquirer([{
            name: ACTION_KEY,
            message: "Digite o nome da sua conta:"
        }]).then(answer => {
            const accountName = answer[ACTION_KEY];
            newUserFilePath = getPathByAccountName(accountName);
            if (isExistingAccount(newUserFilePath)) {
                utils.error("Uma conta com este nome já existe. Escolha outro nome")
                this.create(backToMenu);
            } else {
                fs.writeFileSync(newUserFilePath, process.env.DEFAULT_ACCOUNT_INFO, (err) => {
                    utils.error("Um erro ocorreu ao criar sua conta. Vamos tentar novamente.")
                    backToMenu();
                    return;
                });
                utils.success("Parabéns! Sua conta foi criada!")
                backToMenu();
                return;
            }
        }).catch(_ => {
            utils.error("Erro ao criar conta.");
        })
    },
    getBalance(userFilePath, backToMenu) {
        const data = JSON.parse(fs.readFileSync(userFilePath).toString());
        utils.info(`Você possui R$ ${utils.formatToBRL(data.balance)} reais.`)
        backToMenu();
        return;
    },
    deposit(userFilePath, backToMenu) {
        const data = JSON.parse(fs.readFileSync(userFilePath).toString());
        const currentBalance = data.balance;
        inquirer([{
            name: DEPOSIT_KEY,
            message: "Digite quanto deseja depositar: "
        }]).then(answer => {

            const depositAmount = parseFloat(answer[DEPOSIT_KEY]);

            if (!depositAmount) {
                utils.error("Valor de depósito inválido")
                backToMenu();
                return;
            }
            fs.writeFileSync(userFilePath, updatedAccount(depositAmount + currentBalance), (err) => {
                utils.error("Erro ao realizar deposito. Tente novamente.");
                backToMenu();
                return;
            })
            utils.success("depósito realizado com sucesso!")
            backToMenu()

        }).catch(err => {
            console.log(err)
            utils.error("Erro ao depositar");
        })

    },
    withdraw(userFilePath, backToMenu) {
        const data = JSON.parse(fs.readFileSync(userFilePath).toString());
        const currentBalance = data.balance;
        inquirer([{
            name: WITHDRAW_KEY,
            message: "Digite quanto deseja sacar: "
        }]).then(answer => {

            const withdrawAmount = parseFloat(answer[WITHDRAW_KEY]);
            if (withdrawAmount > currentBalance) {
                utils.error("Saldo insuficiente.");
                backToMenu();
                return;
            }
            fs.writeFileSync(userFilePath, updatedAccount(currentBalance - withdrawAmount), (err) => {
                utils.error("Erro ao realizar deposito. Tente novamente.");
                backToMenu();
                return;
            })
            utils.success(`Saque no valor de ${utils.formatToBRL(withdrawAmount)} realizado com sucesso! 
            Seu saldo atual é de ${utils.formatToBRL(currentBalance - withdrawAmount)}`)
            backToMenu()
            return;

        }).catch(_ => {

            utils.error("Erro ao sacar.");
        })
    },
    checkExistsAccount(returnMenu, action) {
        inquirer([{
            name: ACTION_KEY,
            message: "Digite o nome da sua conta: "
        }]).then(answer => {
            const accountName = answer[ACTION_KEY];
            newUserFilePath = getPathByAccountName(accountName);
            if (isExistingAccount(newUserFilePath)) {
                action(newUserFilePath, returnMenu)
            } else {
                utils.error("Conta não encontrada em nossa base de dados.")
                returnMenu()
            }
        }).catch(_ => {
            utils.error("Erro ao checar existencia da conta.");
        })
    }
}

function getPathByAccountName(accountName) {
    return `${process.env.BASE_PATH}/${accountName}.json`;
}

function updatedAccount(balance) {
    return JSON.stringify({ balance })
}

function isExistingAccount(path) {
    return fs.existsSync(path)
}