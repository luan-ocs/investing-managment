import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from '../../../components/Input';
import axios, { AxiosError } from 'axios';
import { userContext } from '../../../services/userProvider';
import Loading from '../../../assets/Rolling-1s-200px.svg';

export const Login: React.FC = () => {
  const schema = yup.object({
    email: yup
      .string()
      .required('Por favor insira um Email')
      .email('Não consigo reconhecer este email.'),
    password: yup.string().required('Por favor insira uma senha'),
  });

  type FormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const redirect = useNavigate();

  const { user, setUser } = useContext(userContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      redirect('/');
    }
  }, [user]);

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    type ResponseType = {
      statusCode: number;
      data: {
        token: string;
        iat: number;
        exp: number;
        id: string;
        name: string;
        email: string;
      };
    };

    setIsLoading(true);
    try {
      const response = await axios.post<ResponseType>(
        `http://${import.meta.env.VITE_SERVER_URL}/signIn`,
        {
          email,
          password,
        },
      );

      const userData = response.data.data;

      localStorage.setItem('user', JSON.stringify(response.data.data));

      setUser(userData);
    } catch (error) {
      let message;
      if (error instanceof AxiosError) {
        console.log(error);
        switch (error.response?.status) {
          case 403:
            message = 'Email ou Senha incorreto';
            break;
          default:
            message = 'Erro Desconhecido';
            break;
        }
      } else {
        message = String(error);
      }
      setError(message);
    }
    setIsLoading(false);
  };

  return (
    <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
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
        </div>

        <div className="flex justify-between items-center mb-6">
          <Link
            to={'/auth/reset-password'}
            className="text-green-600 hover:text-green-700 focus:text-green-700 active:text-green-800 duration-200 transition ease-in-out"
          >
            Forgot password?
          </Link>
          <Link
            to={'/register'}
            className="text-green-600 hover:text-green-700 focus:text-green-700 active:text-green-800 duration-200 transition ease-in-out"
          >
            Register Now
          </Link>
        </div>

        <button
          type="submit"
          className="inline-block px-7 py-3 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          <div className="flex justify-center">
            {isLoading ? (
              <img src={Loading} alt="Loading" className="w-[14px] mr-2" />
            ) : (
              ''
            )}
            Sign in
          </div>
        </button>
        <span className="text-red-600">{error}</span>
      </form>
    </div>
  );
};

export default Login;
