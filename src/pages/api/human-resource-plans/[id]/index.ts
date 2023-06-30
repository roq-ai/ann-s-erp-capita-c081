import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { humanResourcePlanValidationSchema } from 'validationSchema/human-resource-plans';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.human_resource_plan
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getHumanResourcePlanById();
    case 'PUT':
      return updateHumanResourcePlanById();
    case 'DELETE':
      return deleteHumanResourcePlanById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHumanResourcePlanById() {
    const data = await prisma.human_resource_plan.findFirst(convertQueryToPrismaUtil(req.query, 'human_resource_plan'));
    return res.status(200).json(data);
  }

  async function updateHumanResourcePlanById() {
    await humanResourcePlanValidationSchema.validate(req.body);
    const data = await prisma.human_resource_plan.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteHumanResourcePlanById() {
    const data = await prisma.human_resource_plan.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}