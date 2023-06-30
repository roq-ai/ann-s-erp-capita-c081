import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface HumanResourcePlanInterface {
  id?: string;
  plan_data: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface HumanResourcePlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  plan_data?: string;
  user_id?: string;
}
