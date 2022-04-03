import { useState, ReactNode } from 'react';

import styled from 'styled-components';

import { WebevNextPage } from '@monorepo/client/src/libs/interfaces/webevNextPage';

import { WebevOgpHead } from '@monorepo/client/src/components/common/WebevOgpHead';
import { IconButton } from '@monorepo/client/src/components/base/molecules/IconButton';
import { LoginRequiredWrapper } from '@monorepo/client/src/components/common/Authentication/LoginRequiredWrapper';
import { DirectoryListItem } from '@monorepo/client/src/components/domain/Directory/molecules/DirectoryListItem';

import { useDirectoryPaginationResult } from '@monorepo/client/src/stores/directory';
import { useLocale } from '@monorepo/client/src/hooks/useLocale';

import { toastError, toastSuccess } from '@monorepo/client/src/utils/toastr';
import { DashBoardLayout } from '@monorepo/client/src/components/common/Layout/DashBoardLayout';
import { useCreateDirectory } from '@monorepo/client/src/hooks/Directory/useCreateDirectory';

const Page: WebevNextPage = () => {
  const { t } = useLocale();

  // const [searchKeyWord, setSearchKeyWord] = useState('');
  const { data: directoryPaginationResult, mutate: mutateDirectoryPaginationResult } = useDirectoryPaginationResult({
    searchKeyWord: '',
    isRoot: true,
  });
  const { createDirectory } = useCreateDirectory();

  const [isCreatingNewDirectory, setIsCreatingNewDirectory] = useState(false);
  const [name, setName] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (name.trim() === '') {
      return setIsCreatingNewDirectory(false);
    }

    try {
      toastSuccess(t.toastr_save_directory);
      setName('');
      const result = await createDirectory(name);
      if (directoryPaginationResult) {
        mutateDirectoryPaginationResult(
          {
            ...directoryPaginationResult,
            docs: [...directoryPaginationResult.docs, result],
          },
          false,
        );
      }
    } catch (err) {
      if (err instanceof Error) toastError(err);
    }

    setIsCreatingNewDirectory(false);
  };
  return (
    <>
      <WebevOgpHead title={`Webev | ${t.directory}`} />
      <LoginRequiredWrapper>
        <h1 className="mb-0">{t.directory}</h1>
        <div className="my-3 d-flex flex-column flex-sm-row justify-content-between gap-3">
          {/* <SearchTextBox onChange={(inputValue) => setSearchKeyWord(inputValue)} /> */}
        </div>
        {directoryPaginationResult == null && (
          <div className="pt-5 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {directoryPaginationResult != null && (
          <>
            <div className="row">
              {directoryPaginationResult.docs.map((directory) => (
                <div className="col-xl-4 col-md-6" key={directory._id}>
                  <DirectoryListItem directory={directory} />
                </div>
              ))}
            </div>
            {directoryPaginationResult.docs.length < 10 && (
              <StyledDiv className="text-center mx-3 mt-2 d-md-none">
                {isCreatingNewDirectory ? (
                  <form className="input-group ps-3" onSubmit={onSubmit}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control bg-white"
                      placeholder="...name"
                      autoFocus
                    />
                  </form>
                ) : (
                  <IconButton icon="PLUS_DOTTED" color="LIGHT" activeColor="LIGHT" onClickButton={() => setIsCreatingNewDirectory(true)} />
                )}
              </StyledDiv>
            )}
          </>
        )}
      </LoginRequiredWrapper>
    </>
  );
};

const StyledDiv = styled.div`
  > .btn {
    width: 100%;
    padding: 10px;
    border-radius: 3px;
    :hover {
      background-color: rgba(200, 200, 200, 0.2);
      transition: all 300ms linear;
    }
  }
`;

const getLayout = (page: ReactNode) => <DashBoardLayout>{page}</DashBoardLayout>;

Page.getLayout = getLayout;
export default Page;