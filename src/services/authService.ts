import * as authRepository from "../repositories/companyRepository.js"

export async function validateCompany(apiKey : string){
    const validCompany = await authRepository.findByApiKey(apiKey)
    if(!validCompany) throw {type : "auth_error" , message : "invalid company api key"}
    return validCompany
}