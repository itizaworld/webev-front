import { VFC } from 'react';
import Link from 'next/link';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DefaultLayout } from '~/components/Layout/DefaultLayout';
import { useLocale } from '~/hooks/useLocale';

const Page: VFC = () => {
  const { t } = useLocale();

  return (
    <DefaultLayout>
      <div className="p-3">
        <h1 className="m-3">{t.this_is_the_404_page}</h1>
        <h2>
          <Link href="/">{t.go_to_top}</Link>
        </h2>
      </div>
    </DefaultLayout>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default Page;
