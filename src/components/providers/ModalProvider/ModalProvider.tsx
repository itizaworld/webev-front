import React, { useState, createContext, ReactNode, useContext, useCallback, FC, ComponentProps } from 'react';
import { EditMagazineModal } from '~/components/domain/Magazine';

import { DeletePageModal } from '~/components/domain/Page';
import { ShareLinkReceiverModal } from '~/components/domain/ShareLink/molecules/ShareLinkReceiverModal';
import { TutorialDetectorModal } from '~/components/domain/Tutorial/TutorialDetectorModal';

type EditMagazineModal = {
  name: 'EditMagazineModal';
  args: Omit<ComponentProps<typeof EditMagazineModal>, 'open' | 'onClose'>;
};

type DeletePageModal = {
  name: 'deletePageModal';
  args: Omit<ComponentProps<typeof DeletePageModal>, 'open' | 'onClose'>;
};

type ShareLinkReceiverModal = {
  name: 'shareLinkReceiverModal';
  args: Omit<ComponentProps<typeof ShareLinkReceiverModal>, 'open' | 'onClose'>;
};

type TutorialDetectorModal = {
  name: 'tutorialDetectorModal';
  args: Omit<ComponentProps<typeof TutorialDetectorModal>, 'open' | 'onClose'>;
};

type ModalProps = EditMagazineModal | DeletePageModal | ShareLinkReceiverModal | TutorialDetectorModal | undefined | null;

const DURATION = 195; // モーダルの開閉のアニメーション時間

export const ModalContext = createContext<{
  modal: ModalProps;
  open: boolean;
  handleModal: (props: ModalProps) => void;
}>({ modal: undefined, open: false, handleModal: () => void 0 });

export const ModalProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [modal, setModal] = useState<ModalProps>();
  const [open, setOpen] = useState(false);

  const handleModal = useCallback((args: ModalProps) => {
    if (!args) {
      // モーダルを閉じるときは先にopenをfalsyにして閉じるアニメーションを実行する
      setOpen(false);
      // アニメーションが終了したらmodalをnullにしてコンポーネントを破棄する
      setTimeout(() => setModal(null), DURATION);
    } else {
      setModal(args);
      setOpen(true);
    }
  }, []);

  return (
    <ModalContext.Provider value={{ modal, open, handleModal }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};

const Modal = () => {
  const { modal, open, handleModal } = useContext(ModalContext);
  const handleCancel = useCallback(() => handleModal(null), [handleModal]);

  if (!modal) return null;

  switch (modal.name) {
    case 'EditMagazineModal': {
      return <EditMagazineModal open={open} onClose={handleCancel} {...modal.args} />;
    }
    case 'deletePageModal': {
      return <DeletePageModal open={open} onClose={handleCancel} {...modal.args} />;
    }
    case 'shareLinkReceiverModal': {
      return <ShareLinkReceiverModal open={open} onClose={handleCancel} {...modal.args} />;
    }
    case 'tutorialDetectorModal': {
      return <TutorialDetectorModal open={open} onClose={handleCancel} />;
    }
  }
};
