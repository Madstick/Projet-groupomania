let required = (propertyType, customErrorMessage) => { 
    return v => v && v.length > 0 || customErrorMessage || `Vous devez rentrer un ${propertyType}`
  }  
let minLength = (propertyType, minLength) => {
    return v => {
      if(!v){ return true; }
  
      return v.length >= minLength || `${propertyType} doit faire plus de ${minLength} charactères`;
    }
  }
let maxLength = (propertyType, maxLength) => {
    return v => v && v.length <= maxLength || `${propertyType} doit faire moins de ${maxLength} charactères`
  } 
  
let imgFormat = (attachment) => {
let regex = /(image\/)+(gif|jpe?g|png)$/i 
if(!attachment)
  { return true; }
return v => 
  v && regex.test(v.type) || "Doit être un format valide ( jpg, jpeg, png ou gif )"
}


export default {
    required,
    minLength,
    maxLength,
    imgFormat
  }