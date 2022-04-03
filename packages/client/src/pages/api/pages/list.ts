import { FilterQuery } from 'mongoose';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { PageRepository } from '@monorepo/client/src/infrastructure/repositories/pageRepository';
import { connectDB } from '@monorepo/client/src/middlewares/dbConnect';

import { WebevApiRequest } from '@monorepo/client/src/libs/interfaces/webevApiRequest';
import { injectUserToRequest } from '@monorepo/client/src/middlewares/injectUserToRequest';
import { loginRequired } from '@monorepo/client/src/middlewares/loginRequired';
import { FindPagesUseCase } from '@monorepo/client/src/application/useCases/page';
import { PaginationOptions } from '@monorepo/client/src/libs/interfaces/pagination';
import { Page } from '@monorepo/client/src/domains/Page';

const findPagesUseCase = new FindPagesUseCase(new PageRepository());

const handler = nc()
  .use(connectDB)
  .use(injectUserToRequest)
  .use(loginRequired)
  .get(async (req: WebevApiRequest, res: NextApiResponse) => {
    const { user } = req;
    const { sort, page = '1', limit = '10', q = '', isArchived } = req.query;

    const query: FilterQuery<Page> = {
      createdUser: user._id,
      isDeleted: false,
    };

    if (isArchived === 'true') {
      query.archivedAt = { $ne: undefined };
    } else {
      query.archivedAt = null;
    }

    if (q) {
      query.$or = [{ url: new RegExp(q) }, { title: new RegExp(q) }, { siteName: new RegExp(q) }, { description: new RegExp(q) }];
    }

    const options = new PaginationOptions({ page: parseInt(page), limit: parseInt(limit), sort });

    try {
      const result = await findPagesUseCase.execute(query, options);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

export default handler;