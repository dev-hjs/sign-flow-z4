'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod 스키마
const signupSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다.'),
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  contact: z.string().length(11, '연락처는 11자리여야 합니다.'),
  role: z.enum(['User', 'Admin'], '역할을 선택해주세요.'),
  password: z.string()
    .min(6, '비밀번호는 최소 6자리여야 합니다.')
    .refine(password => /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/.test(password),
      '비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export default function Home() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger, // 유효성 검사 함수
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onSubmit', // onSubmit 발생시 유효성 검사 실행
  });
  // 단계 1에서 다음 단계로 넘어가기 전에 유효성 검사 수행
  const handleNextStep = async () => {
    const result = await trigger(['name', 'email', 'contact', 'role']);
    if (result) {
      setStep(2);
    }
  };
  // 최종 데이터 제출
  const onSubmit = data => {
    console.log(data); // 최종 데이터를 콘솔에 출력
    alert(JSON.stringify(data, null, 2)); // 최종 데이터를 프롬프트 창에 출력
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">계정을 생성합니다</h3>
            <p className="text-sm text-muted-foreground">필수 정보를 입력해보세요.</p>
          </div>
          {step === 1 && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                <input id="name" type="text" {...register("name")} placeholder="홍길동" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
                <input id="email" type="email" {...register("email")} placeholder="hello@example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">연락처</label>
                <input id="contact" type="text" {...register("contact")} placeholder="01012345678" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>}
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">역할</label>
                <select id="role" {...register("role")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">역할 선택</option>
                  <option value="User">사용자</option>
                  <option value="Admin">관리자</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">역할을 선택해주세요</p>}
              </div>
              <button type="button" onClick={handleNextStep} className="flex justify-center w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">다음 단계로</button>
            </>
          )}
          {step === 2 && (
            <div className="space-y-4">
              {/* 비밀번호 설정 폼 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
                <input id="password" type="password" {...register("password")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
                <input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
              <button type="submit" className="flex justify-center w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">계정 등록하기</button>
            </div>
          )}
          {step > 1 && (
            <button type="button" onClick={() => setStep(1)} className="mt-4 flex justify-center w-full rounded-md border border-transparent bg-gray-200 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">이전 단계로</button>
          )}
        </form>
      </div>
    </main>
  );
}