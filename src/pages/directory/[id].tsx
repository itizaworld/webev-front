import { VFC } from 'react';
import { useRouter } from 'next/router';

import { LoginRequiredWrapper } from '~/components/Authentication/LoginRequiredWrapper';
import { DashBoardLayout } from '~/components/Layout/DashBoardLayout';

import { useDirectoryInfomation, usePageListByDirectoryId } from '~/stores/directory';
import { OgpCard } from '~/components/organisms/OgpCard';

const Index: VFC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: directory } = useDirectoryInfomation(id as string);
  const { data: pages } = usePageListByDirectoryId(id as string);

  return (
    <LoginRequiredWrapper>
      <DashBoardLayout>
        <div className="p-3">
          <div className="d-flex align-items-center">
            <h1>{directory?.name}</h1>
          </div>
          {pages != null && (
            <div className="row">
              {pages.map((page) => (
                <div className="col-xl-4 col-md-6 mb-3" key={page._id}>
                  <OgpCard page={page} />
                </div>
              ))}
            </div>
          )}
        </div>
      </DashBoardLayout>
    </LoginRequiredWrapper>
  );
};

export default Index;
