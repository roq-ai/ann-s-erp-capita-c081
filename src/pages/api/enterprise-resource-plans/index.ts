import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { enterpriseResourcePlanValidationSchema } from 'validationSchema/enterprise-resource-plans';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEnterpriseResourcePlans();
    case 'POST':
      return createEnterpriseResourcePlan();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEnterpriseResourcePlans() {
    const data = await prisma.enterprise_resource_plan
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'enterprise_resource_plan'));
    return res.status(200).json(data);
  }

  async function createEnterpriseResourcePlan() {
    await enterpriseResourcePlanValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.enterprise_resource_plan.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
