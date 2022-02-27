import React, { VFC, useState, createContext, ReactNode, SetStateAction, Dispatch } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { Page } from '~/domains/Page';
import { PaginationResult } from '~/libs/interfaces/paginationResult';
import { joinUrl } from '~/utils/joinUrl';
import { restClient } from '~/utils/rest-client';

export const PagePaginationContext = createContext<{
  setSearchKeyword?: Dispatch<SetStateAction<string>>;
  activePage: number;
  setActivePage?: Dispatch<SetStateAction<number>>;
  isSortCreatedAt: boolean;
  setIsSortCreatedAt?: Dispatch<SetStateAction<boolean>>;
  setIsArchived?: Dispatch<SetStateAction<boolean>>;
  pagePagination?: PaginationResult<Page>;
  mutatePagePagination?: KeyedMutator<PaginationResult<Page>>;
}>({
  setSearchKeyword: undefined,
  activePage: 1,
  setActivePage: undefined,
  isSortCreatedAt: false,
  setIsSortCreatedAt: undefined,
  setIsArchived: undefined,
  pagePagination: undefined,
  mutatePagePagination: undefined,
});

export const PagePaginationProvider: VFC<{
  children: ReactNode;
}> = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [limit] = useState(9);
  const [isSortCreatedAt, setIsSortCreatedAt] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const sort = isSortCreatedAt ? 'createdAt' : '-createdAt';

  const params = [`page=${activePage}`, `limit=${limit}`, `sort=${sort}`, `isArchived=${isArchived}`];
  if (searchKeyword) params.push(`&q=${searchKeyword}`);

  const endpoint = joinUrl('/pages/list', params);

  const { data: pagePagination, mutate: mutatePagePagination } = useSWR<PaginationResult<Page>>(endpoint, (endpoint: string) =>
    restClient.apiGet(endpoint).then((result) => result.data),
  );

  return (
    <PagePaginationContext.Provider
      value={{
        setSearchKeyword,
        activePage,
        setActivePage,
        isSortCreatedAt,
        setIsSortCreatedAt,
        setIsArchived,
        pagePagination,
        mutatePagePagination,
      }}
    >
      {children}
    </PagePaginationContext.Provider>
  );
};
