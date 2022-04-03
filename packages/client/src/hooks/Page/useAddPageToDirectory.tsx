import { useCallback, useState } from 'react';
import { Page } from '@monorepo/client/src/domains/Page';
import { restClient } from '@monorepo/client/src/utils/rest-client';
import { usePagePagination } from '.';

export const useAddPageToDirectory = (): { isLoading: boolean; addPageToDirectory: (pageId: string, directoryId: string) => void } => {
  const { pagePagination, mutatePagePagination } = usePagePagination();
  const [isLoading, setIsLoading] = useState(false);

  const addPageToDirectory = useCallback(
    async (pageId: string, directoryId: string) => {
      setIsLoading(true);

      const { data } = await restClient.apiPut<Page>(`/pages/${pageId}/directories`, { directoryId });

      if (!pagePagination) {
        return;
      }

      mutatePagePagination(
        {
          ...pagePagination,
          docs: [...pagePagination.docs.filter((v) => v._id !== pageId), data],
        },
        false,
      );

      setIsLoading(false);
    },
    [mutatePagePagination, pagePagination],
  );

  return { isLoading, addPageToDirectory };
};