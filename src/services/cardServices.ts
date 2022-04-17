import * as faker from '@faker-js/faker';
import * as employeeRepo from "../repositories/employeeRepository.js"
import * as cardRepo from "../repositories/cardRepository.js"
import * as paymentRepo from "../repositories/paymentRepository.js"
import * as rechargeRepo from "../repositories/rechargeRepository.js"
import * as businessRepo from "../repositories/businessRepository.js"
import { TransactionTypes } from '../repositories/cardRepository.js';
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

export async function activateCard(id : number, securityCode : string, password: string ){
    const card = await getCard(id)
    verifyExpireDate(card.expirationDate)
    verifyPasswordExist(card.password)
    verifySecurityCode(card.securityCode, securityCode)
    validPassword(password)
    const encryptedPassword : string = encryptPassword(password)
    return await cardRepo.update(id, {...card , password: encryptedPassword})
}

export async function getBalance(id : number){
    await getCard(id)
    const payments = await getpayments(id)
    const recharges = await getRecharges(id)
    const totalRecharges = getAmountRecharges(recharges) 
    const totalPayments = getAmountPayments(payments)
    const balance = totalRecharges - totalPayments
    return {
        balance,
        payments,
        recharges
    }
}

export async function recharge(cardId : number, amount : number){
    const card = await getCard(cardId)
    verifyExpireDate(card.expirationDate)
    await rechargeRepo.insert({cardId, amount})
    return
}

export async function payment(cardId : number, password: string, businessId : number, amount : number){
    const card = await getCard(cardId)
    verifyExpireDate(card.expirationDate)
    verifyPassword(card.password, password)
    verifyCardIsBlocked(card.isBlocked)
    const business = await getBusiness(businessId)
    await validTransaction(business, card, amount)
    await paymentRepo.insert({cardId, businessId, amount})
    return
}

export async function blockCard(id: number, password: string){
    const card = await getCard(id)
    verifyExpireDate(card.expirationDate)
    if(card.isBlocked === true) throw {erro_type : "bad_request" , message : "Card already blocked"}
    verifyPassword(card.password, password)
    await cardRepo.update(id, {isBlocked : true})
    return
}
export async function unBlockCard(id: number, password: string){
    const card = await getCard(id)
    verifyExpireDate(card.expirationDate)
    console.log(card.isBlocked)
    if(card.isBlocked === false) throw {erro_type : "bad_request" , message : "Card already unblocked"}
    verifyPassword(card.password, password)
    await cardRepo.update(id, {isBlocked : false})
    return
    
}




async function getEmployee(employeeId: number){
    const employee = employeeRepo.findById(employeeId)
    return employee
}
export async function getCard(id: number){
    const card = await cardRepo.findById(id)
    if(!card) throw {erro_type : "not_found_error" , message : "Card not found"}
    return card
}

async function verifyIfCardTypeExist(employeeId: number, type: TransactionTypes){
    const existingCard = cardRepo.findByTypeAndEmployeeId(type, employeeId)
    return existingCard
}

function generateCardNumber(){
    return faker.faker.finance.creditCardNumber('mastercard')
}

function nameFormatter(name : string){
    const newNameArr = name.split(' ')
    let newNamehash = {}
    for(let i=0;i < newNameArr.length;i++){
        if(newNameArr[i].length < 3) continue
        if(i !==0 || i !== newNameArr.length-1) newNamehash[newNameArr[i]] = newNameArr[i][0].toUpperCase()
        if(i === 0) newNamehash[newNameArr[i]] = newNameArr[i].toUpperCase() 
        if(i=== newNameArr.length-1) newNamehash[newNameArr[i]] = newNameArr[i].toUpperCase()
    }
    name = Object.values(newNamehash).join(" ")
     return name
}

function dateFormatter(){
    return dayjs().add(5, "years").format("MM/YY")
}

function generateCVC(){
    const cvc = faker.faker.finance.creditCardCVV()
    console.log(cvc)
    return bcrypt.hashSync(cvc, 10);
}

export function verifyExpireDate(expirationDate : string){
    
    const formatedExpirationDate = `${expirationDate.split("/")[0]}/01/${expirationDate.split("/")[1]}`
    if(dayjs(formatedExpirationDate).isBefore(dayjs())) throw {erro_type : "bad_request" , message : "Card is expired"}
    return
}

function verifyPasswordExist(password : string){
    if(password !== null)  throw {erro_type : "bad_request" , message : "Card already activated"}
}

export function verifySecurityCode(securityCode : string, securityCodeUser : string){
    
    if(bcrypt.compareSync(securityCodeUser, securityCode)) return
    throw {erro_type : "auth_error" , message : "CVC is wrong"}
}
export function verifyPassword(password : string, passwordUser : string){
    
    if(bcrypt.compareSync(passwordUser, password)) return
    throw {erro_type : "auth_error" , message : "password is wrong"}
}

function validPassword(password : string){
    const regex = /[0-9]{4}/
    if(password.match(regex) === null) throw {erro_type : "bad_request" , message : "Password should be 4 numbers"}
    return
}

function encryptPassword(password : string){
    return bcrypt.hashSync(password, 10);
}

async function getpayments(id : number){
    return await paymentRepo.findByCardId(id)
}

async function getRecharges(id : number){
    return await rechargeRepo.findByCardId(id)
}
function getAmountRecharges(arr){
    return arr.reduce((total : number, item) => item.amount + total, 0);
}
function getAmountPayments(arr){
    return arr.reduce((total : number, item) => item.amount + total, 0);
}
export async function getBusiness(id : number){
    const business = await businessRepo.findById(id)
    if(!business) throw {erro_type : "not_found_error" , message : "Card not found"}
    return business
}

export async function validTransaction(business, card, amount : number){
    const payments = await getpayments(card.id)
    const recharges = await getRecharges(card.id)
    const totalRecharges = getAmountRecharges(recharges) 
    const totalPayments = getAmountPayments(payments)
    const balance = totalRecharges - totalPayments
    if(balance < amount) throw {erro_type : "bad_request" , message : "Insufficient balance"}
    if(business.type !== card.type) throw {erro_type : "bad_request" , message : "Business type differs from card type"}
    return
}

export function verifyCardIsBlocked(isBlocked : boolean){
    if(isBlocked === true) throw {erro_type : "bad_request" , message : "Card is blocked"}
    return
}
