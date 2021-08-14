import { ReactNode } from 'react';
import Loader from 'react-loader-spinner';
import { useApiToken, useCurrentUser } from '~/stores/user';
import { LoginRequiredWrapper } from '~/components/common/Authentication/LoginRequiredWrapper';
import { toastSuccess, toastError } from '~/utils/toastr';
import { restClient } from '~/utils/rest-client';
import { useLocale } from '~/hooks/useLocale';

import { WebevNextPage } from '~/interfaces/webevNextPage';
import { WebevOgpHead } from '~/components/common/WebevOgpHead';
import { DashBoardLayout } from '~/components/common/Layout/DashBoardLayout';
import { EditableInput } from '~/components/case/molecules/EditableInput';
import { EditableTextarea } from '~/components/case/molecules/EditableTextarea';
import { UserIcon } from '~/components/domain/User/atoms/UserIcon';

const Page: WebevNextPage = () => {
  const { t } = useLocale();

  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { data: apiToken, mutate: mutateApiToken } = useApiToken();

  const handleUpdateApiToken = async () => {
    try {
      await restClient.apiPut('/users/api-token');
      toastSuccess(t.toastr_update_api_token);
      mutateApiToken();
    } catch (err) {
      toastError(err);
    }
  };

  const updateName = async (name: string): Promise<void> => {
    try {
      await restClient.apiPut('/users/me', { property: { name } });
      mutateCurrentUser();
    } catch (err) {
      toastError(err);
    }
  };

  const updateDescription = async (description: string): Promise<void> => {
    try {
      await restClient.apiPut('/users/me', { property: { description } });
      mutateCurrentUser();
    } catch (err) {
      toastError(err);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center pt-5">
        <Loader type="Triangle" color="#00BFFF" height={100} width={100} />
      </div>
    );
  }

  return (
    <>
      <WebevOgpHead title={`Webev | ${t.user}${t.settings}`} />
      <LoginRequiredWrapper>
        <div className="row mt-3">
          <div className="col-md-3 col-12 text-center mb-3">
            <UserIcon image={currentUser.image} size={140} isCircle />
          </div>
          <div className="col-md-9 col-12 d-flex flex-column gap-2">
            <EditableInput onChange={updateName} value={currentUser.name} isHeader />
            <EditableTextarea value={currentUser.description} onChange={updateDescription} isAllowEmpty placeholder={t.no_description} />
          </div>
        </div>
        <div className="row my-3">
          <label className="col-md-2 mb-2">Api Token</label>
          <div className="input-group col-md-10 col-12">
            <input className="form-control" type="text" readOnly value={apiToken} />
            <button className="btn btn-secondary input-group-text" onClick={handleUpdateApiToken}>
              更新
            </button>
          </div>
        </div>
      </LoginRequiredWrapper>
    </>
  );
};

const getLayout = (page: ReactNode) => <DashBoardLayout>{page}</DashBoardLayout>;

Page.getLayout = getLayout;
export default Page;
