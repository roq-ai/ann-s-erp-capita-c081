import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { managementInformationSystemValidationSchema } from 'validationSchema/management-information-systems';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getManagementInformationSystems();
    case 'POST':
      return createManagementInformationSystem();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getManagementInformationSystems() {
    const data = await prisma.management_information_system
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'management_information_system'));
    return res.status(200).json(data);
  }

  async function createManagementInformationSystem() {
    await managementInformationSystemValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.management_information_system.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
