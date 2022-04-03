import { SWRResponse } from 'swr';

import { restClient } from '@monorepo/client/src/utils/rest-client';
import { useAuthenticationSWR } from '@monorepo/client/src/stores/use-authentication-swr';
import { Ogp } from '@monorepo/client/src/domains/Ogp';

/**
 * urlをもとにOGPを取得するSWR
 * @param url
 */
export const useOgp = (url?: string): SWRResponse<Ogp, Error> => {
  const key = url ? `ogp?url=${url}` : null;
  return useAuthenticationSWR(key, (endpoint: string) => restClient.apiGet(endpoint).then((result) => result.data), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
};