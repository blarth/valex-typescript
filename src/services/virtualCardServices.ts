import "dotenv/config";
import * as faker from '@faker-js/faker';
import * as employeeRepo from "../repositories/employeeRepository.js"
import * as cardRepo from "../repositories/cardRepository.js"
import * as paymentRepo from "../repositories/paymentRepository.js"
import * as rechargeRepo from "../repositories/rechargeRepository.js"
import * as businessRepo from "../repositories/businessRepository.js"
import { TransactionTypes } from '../repositories/cardRepository.js';
import * as cardServices from "../services/cardServices.js"

export async function createVirtualCard(id : number, password : string){
    const card = await cardServices.getCard(Number(id))
    cardServices.verifyPassword(card.password, password)
    const number: string = cardServices.generateCardNumber();
    const expirationDate: string = cardServices.dateFormatter();
    const securityCode: string = cardServices.generateCVC();


    return await cardRepo.insert({
        employeeId : card.employeeId,
        number,
        cardholderName : card.cardholderName,
        securityCode,
        expirationDate,
        isVirtual: true,
        originalCardId: card.id,
        isBlocked: false,
        type : card.type,
        password : card.password
      });
}

export async function deleteVirtualCard(id : number, password : string){
    const card = await cardServices.getCard(Number(id))
    validateIsVirtual(card.isVirtual)
    cardServices.verifyPassword(card.password, password)
    return await cardRepo.remove(id)
}

export async function getCard(id: number) {
    const card = await cardRepo.findById(id);
    if (!card) throw { type: "not_found_error", message: "Original card not found" };
    return card;
}

function validateIsVirtual(isVirtual : boolean){
    if(isVirtual) return
    throw { type: "bad_request", message: "Card isn't virtual" };
}

