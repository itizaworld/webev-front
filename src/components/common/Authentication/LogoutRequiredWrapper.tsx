import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { Oval } from 'react-loader-spinner';

import { HOME_URL } from '~/libs/constants/urls';

export const LoginRequiredWrapper: FC = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(HOME_URL);
    }
  }, [router, status]);

  if (typeof window !== 'undefined' && status === 'loading')
    return (
      <div className="pt-5 d-flex align-items-center justify-content-center">
        <Oval color="#00BFFF" secondaryColor="rgba(0, 191, 255, 0.7)" height={100} width={100} />
      </div>
    );

  if (status === 'unauthenticated') {
    return <>{children}</>;
  }

  return (
    <div className="pt-5 d-flex align-items-center justify-content-center">
      <Oval color="#00BFFF" secondaryColor="rgba(0, 191, 255, 0.7)" height={100} width={100} />
    </div>
  );
};
