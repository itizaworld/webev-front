import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import axios from 'axios';

import { WebevOgpHead } from '~/components/common/WebevOgpHead';

import { imagePath } from '~/libs/constants/imagePath';
import { WebevNextPage } from '~/libs/interfaces/webevNextPage';

import { useLocale } from '~/hooks/useLocale';

import { PageCountupCard } from '~/components/domain/Page/atoms/PageCountupCard';
import { DefaultLayout } from '~/components/common/Layout/DefaultLayout';

type Props = {
  count: number;
};

const Page: WebevNextPage<Props> = ({ count }) => {
  const { t } = useLocale();

  return (
    <>
      <WebevOgpHead />
      <h1>{t.welcome_webev}</h1>
      <Image src={imagePath.EYE_CATCH_DARK} alt={imagePath.EYE_CATCH_DARK} height={1260} width={2240} />
      <div className="row my-3">
        <div className="col-12 col-md-6 offset-md-3">
          <PageCountupCard count={count} text={t.total_pages} />
        </div>
      </div>
      <div className="text-center">
        <Link href="/home">
          <button className="btn btn-purple mt-3">{t.start_immediately}</button>
        </Link>
      </div>
    </>
  );
};

export async function getStaticProps() {
  try {
    const { data: count } = await axios.get<number>(`${process.env.FRONTEND_URL_FROM_NEXT_SERVER || 'http://localhost:3000'}/api/pages/all`);

    return {
      props: {
        count,
      },
      revalidate: 300,
    };
  } catch (error) {
    return {
      props: {
        count: 0,
      },
      revalidate: 300,
    };
  }
}

const getLayout = (page: ReactNode) => <DefaultLayout>{page}</DefaultLayout>;

Page.getLayout = getLayout;
export default Page;
