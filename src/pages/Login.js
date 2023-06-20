import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const LoginInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
`;

const LoginButton = styled.button`
  padding: 10px;
  background-color: #337ab7;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 이메일과 비밀번호 유효성 검사를 수행합니다.
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        setIsEmailValid(isEmailValid);
        setIsPasswordValid(isPasswordValid);

        if (isEmailValid && isPasswordValid) {
            // 유효성 검사를 통과한 경우 로그인 API 호출을 수행합니다.
            try {
                const response = await fetch('http://localhost:8000/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const jwt = data.access_token

                    // JWT를 로컬 스토리지에 저장합니다.
                    localStorage.setItem('jwt', jwt);
                    console.log('jwt?', data)

                    // 로그인이 성공한 경우 홈페이지로 이동합니다.
                    navigate('/todo');
                } else {
                    console.error('로그인 실패');
                }
            } catch (error) {
                console.error('API 요청 실패:', error);
            }
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    return (
        <LoginWrapper>
            <h2>로그인</h2>
            <LoginForm onSubmit={handleSubmit}>
                <LoginInput
                    type="text"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="email-input"
                />
                {!isEmailValid && <span>이메일 형식이 올바르지 않습니다.</span>}
                <LoginInput
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="password-input"
                />
                {!isPasswordValid && <span>비밀번호는 8자 이상이어야 합니다.</span>}
                <LoginButton type="submit" data-testid="signin-button" disabled={!isEmailValid || !isPasswordValid}>
                    로그인
                </LoginButton>
            </LoginForm>
        </LoginWrapper>
    );
};

export default Login;
