import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EnterpriseResourcePlanInterface {
  id?: string;
  plan_data: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface EnterpriseResourcePlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  plan_data?: string;
  user_id?: string;
}
