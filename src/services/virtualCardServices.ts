import "dotenv/config";
import * as cardRepo from "../repositories/cardRepository.js"
import * as cardServices from "../services/cardServices.js"
import * as error from "../utils/errorUtils.js"

export async function createVirtualCard(id : number, password : string){
    const card = await cardServices.getCard(Number(id))
    cardServices.verifyPassword(card.password, password)
    const number: string = cardServices.generateCardNumber();
    const expirationDate: string = cardServices.dateFormatter();
    const securityCode: string = cardServices.generateSecurityCode();


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
    if (!card) throw error.notFoundError("Original card not found")
    return card;
}

function validateIsVirtual(isVirtual : boolean){
    if(isVirtual) return
    throw error.badRequest("Card isn't virtual")
}

