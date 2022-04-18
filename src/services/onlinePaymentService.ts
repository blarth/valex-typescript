import * as cardServices from "../services/cardServices.js"
import * as paymentRepo from "../repositories/paymentRepository.js"
import * as cardRepo from "../repositories/cardRepository.js"
import * as error from "../utils/errorUtils.js"


export async function onlinePayment(number : string, cardholderName: string, expirationDate : string, securityCode : string, businessId : number, amount : number){
    const card = await getCard(number, cardholderName, expirationDate)
    cardServices.verifyExpireDate(card.expirationDate)
    cardServices.verifyCardIsBlocked(card.isBlocked)
    cardServices.verifySecurityCode(card.securityCode, securityCode)
    const originalCard = await getOriginalCard(card.originalCardId)
    const business = await cardServices.getBusiness(businessId)
    await cardServices.validTransaction(business, originalCard, amount)
    await paymentRepo.insert({cardId : originalCard.id, businessId, amount})
    return
}

async function getCard(number : string, cardholderName : string, expirationDate: string){
    const card = await cardRepo.findByCardDetails(number, cardholderName, expirationDate)
    if(!card) throw error.notFoundError("Card not found")
    return card
}

async function getOriginalCard(id : number){
    const card = await cardRepo.findById(id)
    if(!card) throw error.notFoundError("Original card not found")
    return card
}

