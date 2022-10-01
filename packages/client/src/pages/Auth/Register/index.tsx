import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import Input from '../../../components/Input';

// import { Container } from './styles';

const Register: React.FC = () => {
  const schema = yup.object({
    name: yup.string().required('Por favor insira seu nome.'),
    email: yup
      .string()
      .required('Por favor insira um email.')
      .email('Não consigo reconhecer este email.'),
    password: yup.string().required('Por favor insira uma senha.'),
    confirmPassword: yup
      .string()
      .required('Por favor confirme a Senha')
      .oneOf([yup.ref('password')], 'As senhas não coincidem'),
  });

  type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const response = await axios.post(
      `http://${import.meta.env.VITE_SERVER_URL}/signUp`,
      data,
    );

    console.log(response);
  };

  return (
    <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          registerObject={register('name')}
          placeholder="Name"
          error={errors.name?.message?.toString()}
        />

        <Input
          registerObject={register('email')}
          placeholder="Email"
          error={errors.email?.message?.toString()}
        />

        <Input
          registerObject={register('password')}
          placeholder="Password"
          type="password"
          error={errors.password?.message?.toString()}
        />

        <Input
          registerObject={register('confirmPassword')}
          placeholder="Confirm password"
          type="password"
          error={errors.confirmPassword?.message?.toString()}
        />

        <div className="flex justify-between items-center mb-6">
          <Link
            to={'/login'}
            className="text-green-600 hover:text-green-700 focus:text-green-700 active:text-green-800 duration-200 transition ease-in-out"
          >
            Sign In
          </Link>
        </div>
        <button
          type="submit"
          className="inline-block px-7 py-3 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Register;
