import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectToApiTest() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/api-test');
  }, [router]);
  
  return null;
}

// This ensures the page is rendered on client side only
export const getStaticProps = () => {
  return {
    props: {}
  };
}; 