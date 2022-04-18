import * as authRepository from "../repositories/companyRepository.js"
import * as error from "../utils/errorUtils.js"

export async function validateCompany(apiKey : string){
    const validCompany = await authRepository.findByApiKey(apiKey)
    if(!validCompany) throw error.authError("Invalid company api key")
    return validCompany
}