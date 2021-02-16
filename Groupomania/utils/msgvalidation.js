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
  
let msgFormat = () => {
let regex = /\.(gif|jpe?g|png)$/i 
return v => v && regex.test(v) || "Doit être un format valide(jpg,jpeg,png ou gif)"
}


export default {
    required,
    minLength,
    maxLength,
    msgFormat
  }