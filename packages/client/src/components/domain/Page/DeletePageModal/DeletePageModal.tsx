import { VFC } from 'react';

import { Modal } from '@monorepo/client/src/components/base/molecules/Modal';
import { FixedImage } from '@monorepo/client/src/components/base/atoms/FixedImage';
import { restClient } from '@monorepo/client/src/utils/rest-client';
import { toastError, toastSuccess } from '@monorepo/client/src/utils/toastr';

import { useLocale } from '@monorepo/client/src/hooks/useLocale';
import { Page } from '@monorepo/client/src/domains/Page';
import { usePagePagination } from '@monorepo/client/src/hooks/Page';

type Props = {
  open: boolean;
  onClose: () => void;
  page: Page;
};

export const DeletePageModal: VFC<Props> = ({ open, onClose, page }) => {
  const { t } = useLocale();

  const { mutatePagePagination } = usePagePagination();

  const deletePage = async () => {
    try {
      await restClient.apiDelete(`/pages/${page._id}`);
      toastSuccess(t.toastr_delete_url);
      mutatePagePagination();
      onClose();
    } catch (err) {
      if (err instanceof Error) toastError(err);
    }
  };

  return (
    <Modal isOpen={open} toggle={onClose} title={t.delete_page}>
      <FixedImage imageUrl={page.image} />
      <h5 className="card-title my-3">{page.title}</h5>
      <div className="d-flex justify-content-evenly">
        <button className="btn btn-secondary" onClick={onClose}>
          {t.cancel}
        </button>
        <button className="btn btn-danger" onClick={deletePage}>
          {t.delete}
        </button>
      </div>
    </Modal>
  );
};