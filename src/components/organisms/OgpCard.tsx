import { VFC, useEffect, useState } from 'react';

import { UncontrolledTooltip, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { DragDropContext, Droppable, Draggable, DragUpdate } from 'react-beautiful-dnd';

import { format } from 'date-fns';

import urljoin from 'url-join';
import { useTranslation } from 'react-i18next';
import style from 'styled-components';

import { Icon } from '../Icons/Icon';
import { IconButton } from '~/components/Icons/IconButton';
import { restClient } from '~/utils/rest-client';
import { toastError, toastSuccess } from '~/utils/toastr';

import { BootstrapColor, BootstrapIcon } from '~/interfaces/variables';
import { Page, PageStatus } from '~/interfaces/page';

import { usePageListSWR } from '~/stores/page';
import { usePageForDelete, useIsOpenDeletePageModal } from '~/stores/modal';

const MAX_WORD_COUNT_OF_BODY = 96;
const MAX_WORD_COUNT_OF_SITENAME = 10;

type Props = {
  page: Page;
};

export const OgpCard: VFC<Props> = ({ page }: Props) => {
  const { t } = useTranslation();

  const { mutate: mutatePageList } = usePageListSWR();
  const { _id, url, siteName, image, title, description, createdAt } = page;
  const [isArchive, setIsArchive] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { mutate: mutatePageForDelete } = usePageForDelete();
  const { mutate: mutateIsOpenDeletePageModal } = useIsOpenDeletePageModal();

  useEffect(() => {
    setIsArchive(page.status === PageStatus.PAGE_STATUS_ARCHIVE);
    setIsFavorite(page.isFavorite);
  }, [page]);

  const sharePage = async () => {
    if (window != null) {
      const twitterUrl = urljoin('https://twitter.com/intent/tweet', `?url=${encodeURIComponent(url)}`, `&hashtags=${siteName}`);
      window.open(twitterUrl, '_blanck');
    }
  };

  const switchArchive = async () => {
    try {
      const { data: page } = await restClient.apiPut(`/pages/${_id}/archive`, { isArchive: !isArchive });
      toastSuccess(t('toastr.success_archived'));
      setIsArchive(page.status === PageStatus.PAGE_STATUS_ARCHIVE);
      mutatePageList();
    } catch (err) {
      toastError(err);
    }
  };

  const switchFavorite = async () => {
    try {
      const { data: page } = await restClient.apiPut(`/pages/${_id}/favorite`, { isFavorite: !isFavorite });
      toastSuccess(t('toastr.update', { target: t('favorite') }));
      setIsFavorite(page.isFavorite);
      mutatePageList();
    } catch (err) {
      toastError(err);
    }
  };

  const openDeleteModal = async () => {
    mutatePageForDelete(page);
    mutateIsOpenDeletePageModal(true);
  };

  return (
    <StyledCard className="card border-0 shadow">
      <StyledImageWrapper>
        <a href={url} target="blank" rel="noopener noreferrer">
          <img src={image} alt={image} className="card-img-top" />
        </a>
      </StyledImageWrapper>
      <div className="card-body p-2">
        <h5 className="card-title my-1">
          <a className="text-white text-decoration-none" href={url} target="blank" rel="noopener noreferrer">
            {title}
          </a>
        </h5>
        <p className="small mt-2">{description?.length > MAX_WORD_COUNT_OF_BODY ? description?.substr(0, MAX_WORD_COUNT_OF_BODY) + '...' : description}</p>
        <div className="d-flex align-items-center">
          <div className="me-auto">
            <small>
              <span id={`sitename-for-${page._id}`}>
                {siteName?.length > MAX_WORD_COUNT_OF_SITENAME ? description?.substr(0, MAX_WORD_COUNT_OF_SITENAME) + '...' : siteName}
              </span>
              {siteName?.length > MAX_WORD_COUNT_OF_SITENAME && (
                <UncontrolledTooltip placement="top" target={`sitename-for-${page._id}`}>
                  {siteName}
                </UncontrolledTooltip>
              )}
              <br />
              {format(new Date(createdAt), 'yyyy/MM/dd HH:MM')}
            </small>
          </div>
          <DragDropContext onDragEnd={() => console.log('hoge')}>
            <Droppable droppableId="directories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Draggable key={page._id} draggableId={page._id} index={1}>
                    {(provided) => (
                      <div key={page._id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <IconButton
                          width={24}
                          height={24}
                          icon={BootstrapIcon.ADD_TO_DIRECTORY}
                          color={BootstrapColor.SECONDARY}
                          activeColor={BootstrapColor.INFO}
                          isActive={isArchive}
                          onClickButton={switchArchive}
                        />
                      </div>
                    )}
                  </Draggable>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div id={`archive-for-${page._id}`}>
            <IconButton
              width={24}
              height={24}
              icon={BootstrapIcon.ARCHIVE}
              color={BootstrapColor.SECONDARY}
              activeColor={BootstrapColor.DANGER}
              isActive={isArchive}
              onClickButton={switchArchive}
            />
          </div>
          <UncontrolledTooltip placement="top" target={`archive-for-${page._id}`}>
            Archive
          </UncontrolledTooltip>
          <div id={`favorite-for-${page._id}`}>
            <IconButton
              width={24}
              height={24}
              icon={BootstrapIcon.STAR}
              isActive={isFavorite}
              color={BootstrapColor.SECONDARY}
              activeColor={BootstrapColor.WARNING}
              onClickButton={switchFavorite}
            />
          </div>
          <UncontrolledTooltip placement="top" target={`favorite-for-${page._id}`}>
            Favorite
          </UncontrolledTooltip>
          <UncontrolledDropdown direction="up">
            <DropdownToggle tag="span">
              <div id={`manage-for-${page._id}`}>
                <IconButton
                  width={24}
                  height={24}
                  icon={BootstrapIcon.THREE_DOTS_VERTICAL}
                  color={BootstrapColor.SECONDARY}
                  activeColor={BootstrapColor.WARNING}
                />
              </div>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-dark">
              <DropdownItem tag="button" onClick={openDeleteModal}>
                <Icon icon={BootstrapIcon.TRASH} color={BootstrapColor.WHITE} />
                <span className="ms-2">Trash</span>
              </DropdownItem>
              <DropdownItem tag="button" onClick={sharePage}>
                <Icon icon={BootstrapIcon.TWITTER} color={BootstrapColor.WHITE} />
                <span className="ms-2">Share</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    </StyledCard>
  );
};

const StyledCard = style.div`
  background-color: #2f363d;
`;

const StyledImageWrapper = style.div`
  position: relative;
  width: 100%;
  padding-top: 55%;

  img {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-image: url('/spinner.gif');
    background-repeat: no-repeat;
    background-position: center center;
  }
`;
