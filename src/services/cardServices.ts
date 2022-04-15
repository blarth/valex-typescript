import * as faker from '@faker-js/faker';
import * as employeeRepo from "../repositories/employeeRepository.js"
import * as cardRepo from "../repositories/cardRepository.js"
import { TransactionTypes } from '../repositories/cardRepository';
import dayjs from "dayjs"
import bcrypt from "bcrypt"
import "dotenv/config";

export async function createCard(apiKey : string, employeeId : number, type: TransactionTypes ){
    const employee = await getEmployee(employeeId)
    if(!employee) throw {erro_type : "not_found_error" , message : "Employee not found"}
    const existingCard = await verifyIfCardTypeExist(employeeId, type)
    if(existingCard) throw {erro_type : "conflict_error" , message : "Card type already in use for that employee"}
    const number : string = generateCardNumber()
    const cardholderName : string = nameFormatter(employee.fullName)
    const expirationDate : string = dateFormatter()
    const securityCode : string = generateCVC()
    return await cardRepo.insert({
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        isVirtual : false,
        originalCardId : null,
        isBlocked : true,
        type,})
}


async function getEmployee(employeeId: number){
    const employee = employeeRepo.findById(employeeId)
    return employee
}

async function verifyIfCardTypeExist(employeeId: number, type: TransactionTypes){
    const existingCard = cardRepo.findByTypeAndEmployeeId(type, employeeId)
    return existingCard
}

function generateCardNumber(){
    return faker.faker.finance.creditCardNumber('mastercard')
}

function nameFormatter(name : string){
    const newName : string = ""
    const nameArray : string[] = name.split(" ")
    for(let i= 0; i< nameArray.length; i++){
        if(nameArray[i].length < 3) continue
        if(i === 0) newName + nameArray[i].toUpperCase()
        if(i === nameArray.length-1) newName + nameArray[i].toUpperCase
        newName + nameArray[i][0].toUpperCase
    }
    return newName
}

function dateFormatter(){
    return dayjs().add(5, "years").format("MM/YY")
}

function generateCVC(){
    const cvc = faker.faker.finance.creditCardCVV()
    return bcrypt.hashSync(cvc, 10);
}