import * as yup from 'yup';

export const loginSchema=yup.object().shape({
  

    email:yup.string().email('Please enter a valid email').required('Email is required'),
    password:yup
    .string()
    .min(5,'password should contain 5-16 characters')
    .max(16,'password should contain 5-16 characters')
    .required('Password is Required')
});