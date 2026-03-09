👟 Sneaker Shop
Next.js 14 + Node.js 풀스택 쇼핑몰 프로젝트
📖 프로젝트 소개
스니커즈 쇼핑몰 풀스택 프로젝트입니다.
SSG/SSR/CSR 렌더링 전략을 상황에 맞게 적용하고, JWT 인증과 장바구니/위시리스트/주문 기능을 구현했습니다.
🛠 기술 스택
Frontend

Next.js 14 (App Router)
TypeScript
Tailwind CSS + shadcn/ui
Zustand (전역 상태 관리)
React Query (서버 상태 관리)
Axios (API 통신 + 인터셉터)

Backend

Node.js + Express
TypeScript
PostgreSQL + Prisma
JWT (AccessToken + RefreshToken)

📁 프로젝트 구조
sneaker-shop/
├── frontend/          # Next.js 14 App Router
└── backend/           # Node.js Express API 서버
✨ 주요 기능

회원가입 / 로그인 (JWT 인증)
상품 목록 / 상품 상세
장바구니
주문 / 주문 내역
위시리스트

🏗 렌더링 전략
페이지방식이유홈SSG자주 바뀌지 않는 데이터, SEO 최적화상품 상세SSR실시간 재고 반영 필요장바구니 / 주문CSR개인화 데이터, 서버사이드 불필요
🔐 인증 방식

AccessToken (15분) + RefreshToken (7일)
RefreshToken은 httpOnly Cookie에 저장 → XSS 공격 방어
Axios 인터셉터로 401 응답 시 토큰 자동 갱신

🚀 로컬 실행 방법
사전 요구사항

Node.js 18+
PostgreSQL

Backend
bashcd backend
npm install
cp .env.example .env  # 환경변수 설정
npx prisma migrate dev
npm run dev
Frontend
bashcd frontend
npm install
# .env.local 파일 생성 후 아래 내용 입력
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
🌐 환경변수
backend/.env
DATABASE_URL="postgresql://유저명:비밀번호@localhost:5432/DB이름"
ACCESS_TOKEN_SECRET="액세스_토큰_시크릿"
REFRESH_TOKEN_SECRET="리프레시_토큰_시크릿"
NODE_ENV="development"
PORT=4000
frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
