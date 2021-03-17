let required = (propertyType, customErrorMessage) => { 
    return v => v && v.length > 0 || customErrorMessage || `Vous devez rentrer un ${propertyType}`
  }
let minLength = (propertyType, minLength) => {
    return v => {
      if(!v){ return true; }  
      return v.length >= minLength || `${propertyType} doit être plus de ${minLength} charactères`;
    }
  }
let maxLength = (propertyType, maxLength) => {
    return v => v && v.length <= maxLength || `${propertyType} doit être moins de ${maxLength} charactères`
  }
  
let emailFormat = () => {
    let regex = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(groupomania|)\.com$/
    return v => v && regex.test(v) || "Doit être un email valide"
  }
  
  export default {
    required,
    minLength,
    maxLength,
    emailFormat
  }