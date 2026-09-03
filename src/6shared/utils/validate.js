export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

export const validatePassword = (password) => {
    const length = password.trim().length;
    return length >= 8 && length <= 10
}

export const validateLoginForm = (email, password) => {
    const errors = {}

    if (!email.trim()) {
        errors.email = "Это поле обязательно для заполнения.";
    } else if (!validateEmail(email)) {
        errors.email = "Введите корректный email.";
    }

    if (!password.trim()) {
        errors.password = "Это поле обязательно для заполнения";
    } else if (password.length < 8) {
        errors.password = "Пароль должен быть не менее 8 символов"
    } else if (password.length > 10) {
        errors.password = "Пароль должен быть не более 10 символов"
    }

    return {isValid: Object.keys(errors).length === 0, errors}
}

export const validateForgotPasswordForm = (email) => {
    const errors = {}

    if (!email.trim()) {
        errors.email = "Это поле обязательно для заполнения.";
    } else if (!validateEmail(email)) {
        errors.email = "Введите корректный email.";
    }

    return {isValid: Object.keys(errors).length === 0, errors}
}

/*Валадиация админа*/

export const validatePhone = (phone) => {

    const phoneNumbers = phone.replace(/\D/g, '');

    if (phoneNumbers.length !== 11) {
        return false;
    }

    if (!['7', '8'].includes(phoneNumbers[0])) {
        return false;
    }

    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone);
}

// export const formatPhone = (phone) => {
//     if (!phone) return '';
//
//     const numbers = phone.replace(/\D/g, '');
//
//     if (numbers.length === 0) return '';
//
//     // Форматируем в формат: "+7 (913) 221 0101"
//     if (numbers.length <= 1) {
//         return numbers;
//     } else if (numbers.length <= 4) {
//         return `+7 (${numbers.slice(1, 4)}`;
//     } else if (numbers.length <= 7) {
//         return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`;
//     } else if (numbers.length <= 9) {
//         return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)} ${numbers.slice(7, 9)}`;
//     } else {
//         return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)} ${numbers.slice(7, 9)}${numbers.slice(9, 11)}`;
//     }
// }
export const formatPhone = (value, prevValue = '') => {
    if (!value) return '';


    const isDeleting = value.length < prevValue.length;


    let numbers = value.replace(/\D/g, '');


    if (isDeleting) {
        return numbers
            .replace(/^8/, '7')
            .replace(/^9/, '79')
            .slice(0, 11);
    }


    if (numbers.startsWith('8')) {
        numbers = '7' + numbers.slice(1);
    }

    if (numbers.startsWith('9')) {
        numbers = '7' + numbers;
    }

    if (numbers.length > 11) {
        numbers = numbers.slice(0, 11);
    }
    
    let formatted = '+7';
    if (numbers.length > 1) formatted += ` (${numbers.slice(1, 4)}`;
    if (numbers.length >= 4) formatted += `) ${numbers.slice(4, 7)}`;
    if (numbers.length >= 7) formatted += `-${numbers.slice(7, 9)}`;
    if (numbers.length >= 9) formatted += `-${numbers.slice(9, 11)}`;

    return formatted;
};


export const validateINN = (inn) => {
    if (!inn) return false;

    const innString = inn.toString().trim();
    const innLength = innString.length;

    if (innLength !== 12 && innLength !== 10) {
        return false;
    }

    if (!/^\d+$/.test(innString)) {
        return false;
    }

    return true;
}

export const validateKPP = (kpp) => {
    if (!kpp) return false;

    const kppString = kpp.toString().trim();

    if (kppString.length !== 9) {
        return false;
    }

    const kppRegex = /^\d{4}[\dA-Z]{2}\d{3}$/;
    return kppRegex.test(kppString);
}

export const validateUserForm = (formData) => {
    const errors = {}

    // Валидация организации (обязательное поле)
    if (!formData.organization?.trim()) {
        errors.organization = "Это поле обязательно для заполнения.";
    }

    // Валидация ИНН с использованием готовой функции
    if (!formData.inn?.trim()) {
        errors.inn = "Это поле обязательно для заполнения.";
    } else if (!validateINN(formData.inn)) {
        errors.inn = "ИНН должен содержать 12 цифр";
    }

    // Валидация КПП с использованием готовой функции (не обязательное поле)
    if (formData.kpp && formData.kpp.trim() && !validateKPP(formData.kpp)) {
        errors.kpp = "КПП должен содержать 9 символов в формате 1234AB123";
    }

    // Валидация телефона с использованием готовой функции
    if (!formData.phone_number?.trim()) { // Исправлено на phone_number
        errors.phone_number = "Это поле обязательно для заполнения.";
    } else if (!validatePhone(formData.phone_number)) { // Исправлено на phone_number
        errors.phone_number = "Введите корректный номер телефона";
    }

    // Валидация email с использованием готовой функции
    if (!formData.email?.trim()) {
        errors.email = "Это поле обязательно для заполнения.";
    } else if (!validateEmail(formData.email)) {
        errors.email = "Введите корректный email.";
    }

    // Валидация пароля с использованием готовой функции
    if (!formData.password?.trim()) {
        errors.password = "Это поле обязательно для заполнения";
    } else if (!validatePassword(formData.password)) {
        errors.password = "Пароль должен быть от 8 до 10 символов";
    }

    // Валидация юридического адреса (теперь обязательное поле)
    if (!formData.legal_address?.trim()) {
        errors.legal_address = "Это поле обязательно для заполнения.";
    }

    // Валидация типа цены (обязательное поле)
    if (!formData.price_type?.trim()) {
        errors.price_type = "Это поле обязательно для заполнения.";
    }

    return {isValid: Object.keys(errors).length === 0, errors}
}
