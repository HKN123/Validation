//Đói tượng 'validator'
function validator (options){
    var selectorRules  = {}

    // ham thuc hien validate
function validate(inputElement,rule)
    {  var errorMessage ;
        var errorElement = inputElement.parentElement.querySelector('.form-message')
    // Lấy qua các rules của selector
        var rules = selectorRules[rule.selector]
     // Lặp qua từng rule & kiểm tra 
     // Nếu có lỗi thì dừng việc kiểm tra   
        for (var i = 0 ; i < rules.length ; i++){
            errorMessage = rules[i](inputElement.value)
        if ( errorMessage)break ;
        }
           
        if(errorMessage) {
          errorElement.innerText = errorMessage ;                  
          inputElement.parentElement.classList.add('invalid')
        }         
        else {
            errorElement.innerText = '' ;
            inputElement.parentElement.classList.remove('invalid')
            
        }   
    return !errorMessage    } 
        
        
// Lấy  element cuả form cần validate
 var formElement = document.querySelector(options.form)
if(formElement)
{
    // Khi submit form
    formElement.onsubmit = function(e){
        e.preventDefault();
        var isFormValid = true ; 
        //  Thực hiện lặp qua từng rule và validate
        options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector)  
            var isValid =  validate(inputElement,rule)
            if ( !isValid) {
                isFormValid = false 

                

            }

        })                      
       
        if ( isFormValid  ) {
            if (typeof options.onSubmit === 'function'){
                var enableInputs = formElement.querySelectorAll('[name]:not([disable])')
                var formValues = Array.from(enableInputs).reduce(function(values,input){
                    values[input.name] = input.value
                    return values
                },{})
                options.onSubmit(formValues)
            }           
            }
            else{
                console.log('Chưa điền gì kìa má')
            }
          

    }
//lặp lại mỗi rule và xử lý (lắng nghe sự kiện blur ,input..)
    options.rules.forEach(function(rule){

// Lưu lại các rules cho mỗi input
if(Array.isArray(selectorRules[rule.selector])) {
    selectorRules[rule.selector].push(rule.test)

}
else {
    selectorRules[rule.selector] = [rule.test]

}



    // value : inputElement.value
    // test func : rule.test
    var inputElement = formElement.querySelector(rule.selector)
   if ( inputElement){
    // xử lí khi blur khỏi input
        inputElement.onblur = function(){
            validate(inputElement,rule)
           
          
        }
        // xử lí khi dùng nhập vào input 
        inputElement.oninput = function (){
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
            errorElement.innerText = '' ;
            inputElement.parentElement.classList.remove('invalid')

        }
    }

})

}
}
// Định nghĩa rules
// Nguyên tắc  của các rules : 
//1 . khi có lỗi => trả ra mess lỗi
// 2. khi hợp lệ => không trả ra gì cả (undefined)
//.trim() loại bỏ dấu cách 2 bên
validator.isRequired = function (selector){
return {
    selector,
    test : function(value){
        return value.trim() ? undefined : 'Vui lòng nhập ở đây'


    }
}
}
validator.isEmail = function (selector, message){
    return {
        selector,
        test : function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
           return regex.test(value) ? undefined : message || 'Email không hợp lệ' 
        }
    }

}
validator.minLength = function (selector , min , message){
return {
    selector,
    test : function(value){
        return value.length >= min ? undefined :message || `Vui lòng nhập tối thiêu  ${min} kí tự`


    }
}}
validator.isConfirmed = function (selector , getConfirmValue , message){
    return {
        selector,
        test : function(value){
            return value === getConfirmValue() ? undefined : message || 'Kí tự không chính xác '
    
    
        }
    }}
 