import * as yup from 'yup';

export const registrationSchema=yup.object().shape({
  

    email:yup.string().email('Please enter a valid email').required('Email is required'),
    username:yup
    .string()
    .min(2,'username must be at least 2 characters')
    .max(20)
    .matches(/^[a-zA-Z]+$/, 'Only alphabets are allowed')
    .required('Username is required'),
    password:yup
    .string()
    .min(5,'password should contain 5-16 characters')
    .max(16,'password should contain 5-16 characters')
    .required('Password is Required')
});