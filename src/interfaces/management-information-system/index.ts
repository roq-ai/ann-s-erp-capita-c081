import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ManagementInformationSystemInterface {
  id?: string;
  system_data: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface ManagementInformationSystemGetQueryInterface extends GetQueryInterface {
  id?: string;
  system_data?: string;
  user_id?: string;
}
