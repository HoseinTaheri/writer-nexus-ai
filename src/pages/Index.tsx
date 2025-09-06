// مسیر فایل: frontend/src/pages/index.tsx

import type { GetServerSideProps } from 'next';

// از آنجایی که کاربر همیشه هدایت می شود، این کامپوننت هیچگاه نمایش داده نخواهد شد.
// بنابراین می تواند خالی باشد.
const HomePage = () => {
  return null;
};

// این تابع در سمت سرور قبل از ارسال صفحه به مرورگر اجرا می شود.
// ما از آن برای هدایت کاربر به صفحه لاگین استفاده می کنیم.
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/auth/login', // آدرس صفحه لاگین
      permanent: false, // چون این یک هدایت دائمی نیست
    },
  };
};

export default HomePage;
