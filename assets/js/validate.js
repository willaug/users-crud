//validate
function validateForm(form){
    let fields = document.getElementById(form).querySelectorAll("[required]")
    
    for(field of fields){
        field.addEventListener('invalid', event => {
            event.preventDefault()
            customValidation(event)  
        })
        field.addEventListener('blur', customValidation)
    }

    function validateField(input){

        function verifyErrors(){
            let foundError = false
    
            for(errors in input.validity){
                if(input.validity[errors] && !input.validity.valid)
                    foundError = errors
            }
    
            return foundError
        }

        function customMessage(typeError){
            const messages = { 
                text: {
                    valueMissing: 'Informação necessária!',
                    patternMismatch: 'Insira um texto válido!'
                },
                email: {
                    valueMissing: 'E-mail necessário!',
                    typeMismatch: 'Insira um e-mail válido!'
                }
            }

            return messages[input.type][typeError]
            
        }

        function setCustomMessage(message){
            const spanError = input.parentNode.querySelector('span.error')
            
            if(message){
                spanError.classList.add('active')
                spanError.innerHTML = message
            }else{
                spanError.classList.remove('active')
            }
        }

        return function(){
            const error = verifyErrors()
            
            if(error){
                const message = customMessage(error)
                setCustomMessage(message)
            }
            else{
                setCustomMessage()
            }
        }
    }

    function customValidation(event){
        let input = event.target
        const validation = validateField(input)
        validation()
    }

}