import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PerformanceAppraisalInterface {
  id?: string;
  appraisal_data: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PerformanceAppraisalGetQueryInterface extends GetQueryInterface {
  id?: string;
  appraisal_data?: string;
  user_id?: string;
}
