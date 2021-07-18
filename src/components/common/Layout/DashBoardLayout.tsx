import { FC, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { useActivePage, useDirectoryId, useSearchKeyWord } from '~/stores/page';
import { useCurrentUser } from '~/stores/user';

import { Navbar } from '~/components/common/Navbar';
import { Sidebar } from '~/components/common/Sidebar';
import { SubnavBar } from '~/components/common/SubnavBar';
import { Footer } from '~/components/common/Footer';

import { AddDirectoryModal } from '~/components/PageModals/AddDirectoryModal';
import { CreateDirectoryModal } from '~/components/PageModals/CreateDirectoryModal';
import { PageDeleteModal } from '~/components/domain/Page/molecules/PageDeleteModal';
import { DeleteDirectoryModal } from '~/components/PageModals/DeleteDirectoryModal';
import { RenameDirectoryModal } from '~/components/PageModals/RenameDirectoryModal';
import { SavePageModal } from '~/components/PageModals/SavePageModal';

import { SocketConnector } from '~/components/domain/Socket/SocketConnector';
import { ShareLinkReceiverModal } from '~/components/domain/ShareLink/molecules/ShareLinkReceiverModal';
import { TutorialDitecterModal } from '~/components/domain/Tutorial/molecules/TutorialDitecterModal';
import { ScrollTopButton } from '~/components/case/atoms/ScrollTopButton';

import { BootstrapBreakpoints } from '~/interfaces/variables';

export const DashBoardLayout: FC = ({ children }) => {
  const [session] = useSession();
  const router = useRouter();
  const { mutate: mutateActivePage } = useActivePage();
  const { mutate: mutateDirectoryId } = useDirectoryId();

  const { mutate: mutateSearchKeyord } = useSearchKeyWord();

  const { data: currentUser } = useCurrentUser();

  if (typeof window === 'undefined') {
    return null;
  }

  useEffect(() => {
    mutateSearchKeyord('');

    if (router.pathname !== '/directory/[id]') {
      mutateDirectoryId(null);
    }
    mutateActivePage(1);
  }, [router]);

  return (
    <div>
      <div className="bg-dark">
        <Navbar />
      </div>
      <StyledBorder />
      <SubnavBar />
      <StyledDiv className="d-flex mx-auto">
        <div className="d-none d-md-block col-md-3">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9">{children}</div>
        {session && (
          <>
            <PageDeleteModal />
            <AddDirectoryModal />
            <CreateDirectoryModal />
            <DeleteDirectoryModal />
            <RenameDirectoryModal />
            <SavePageModal />
          </>
        )}
        {session && <SocketConnector />}
        {session && <ShareLinkReceiverModal />}
        {currentUser && <TutorialDitecterModal />}
        <ScrollTopButton />
      </StyledDiv>
      <Footer />
    </div>
  );
};

const StyledDiv = styled.div`
  max-width: 1240px;
  /* 画面全体からNavbarとFooterの高さを引く */
  min-height: calc(100vh - 100px - 100px);
`;

const StyledBorder = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #f6d02e 0, #f87c00 47%, #f6d02e);
  @media (min-width: ${BootstrapBreakpoints.md}px) {
    position: sticky;
    top: 0;
    z-index: 980;
  }
`;
