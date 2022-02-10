import { useEffect, ReactNode } from 'react';
import { Triangle } from 'react-loader-spinner';

import { WebevOgpHead } from '~/components/common/WebevOgpHead';

import { PageStatus } from '~/domains/Page';
import { usePageListSWR, usePageStatus, useSearchKeyWord } from '~/stores/page';
import { useLocale } from '~/hooks/useLocale';

import { WebevNextPage } from '~/libs/interfaces/webevNextPage';

import { SearchTextBox } from '~/components/case/molecules/SearchTextBox';
import { LoginRequiredWrapper } from '~/components/common/Authentication/LoginRequiredWrapper';
import { SortButtonGroup } from '~/components/common/SortButtonGroup';
import { PageList } from '~/components/domain/Page/molecules/PageList';
import { DashBoardLayout } from '~/components/common/Layout/DashBoardLayout';

const Index: WebevNextPage = () => {
  const { t } = useLocale();

  const { data: paginationResult } = usePageListSWR();
  const { mutate: mutatePageStatus } = usePageStatus();
  const { mutate: mutateSearchKeyword } = useSearchKeyWord();

  useEffect(() => {
    mutatePageStatus([PageStatus.PAGE_STATUS_STOCK]);
  }, [mutatePageStatus]);

  return (
    <>
      <WebevOgpHead title={`Webev | ${t.home}`} />
      <LoginRequiredWrapper>
        <div className="d-flex align-items-center">
          <h1 className="mb-0">{t.home}</h1>
          <div className="ms-auto">
            <span className="badge rounded-pill bg-secondary text-white">{paginationResult?.totalDocs} Pages</span>
          </div>
        </div>
        <div className="my-3 d-flex flex-column flex-sm-row justify-content-between gap-3">
          <SearchTextBox onChange={mutateSearchKeyword} />
          <SortButtonGroup />
        </div>
        {paginationResult == null && (
          <div className="text-center pt-5">
            <Triangle color="#00BFFF" height={100} width={100} />
          </div>
        )}
        {paginationResult != null && (
          <PageList pages={paginationResult?.docs} pagingLimit={paginationResult.limit} totalItemsCount={paginationResult.totalDocs} />
        )}
      </LoginRequiredWrapper>
    </>
  );
};

const getLayout = (page: ReactNode) => <DashBoardLayout>{page}</DashBoardLayout>;

Index.getLayout = getLayout;
export default Index;
