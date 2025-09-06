// مسیر فایل: frontend/src/pages/index.tsx

import type { GetServerSideProps } from 'next';

// این کامپوننت هرگز نمایش داده نمی شود چون همیشه هدایت اتفاق می افتد.
const HomePage = () => {
  return null;
};

// این تابع در سمت سرور اجرا شده و کاربر را به آدرس صحیح صفحه لاگین هدایت می کند.
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      //      ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      destination: '/auth/login', // <<<--- این خط اصلاح شد
      //      ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
      permanent: false,
    },
  };
};

export default HomePage;
