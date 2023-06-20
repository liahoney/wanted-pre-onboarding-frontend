import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SignUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const SignUpInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
`;

const SignUpButton = styled.button`
  padding: 10px;
  background-color: #337ab7;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const SignUp = () => {
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
      try {
        // 회원가입 요청을 보냅니다.
        const response = await fetch('http://localhost:8000/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (response.ok) {
          // 회원가입이 정상적으로 완료되면 /signin 경로로 이동합니다.
          navigate('/signin');
        } else {
          // 회원가입 실패 시 에러 처리 로직을 작성합니다.
          console.error('회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입 요청을 처리하는 중에 오류가 발생했습니다.', error);
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
    <SignUpWrapper>
      <h2>회원가입</h2>
      <SignUpForm onSubmit={handleSubmit}>
        <SignUpInput
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
        {!isEmailValid && <span>이메일 형식이 올바르지 않습니다.</span>}
        <SignUpInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="password-input"
        />
        {!isPasswordValid && <span>비밀번호는 8자 이상이어야 합니다.</span>}
        <SignUpButton type="submit" data-testid="signup-button" disabled={!isEmailValid || !isPasswordValid}>
          가입하기
        </SignUpButton>
      </SignUpForm>
    </SignUpWrapper>
  );
};

export default SignUp;
