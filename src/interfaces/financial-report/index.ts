import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface FinancialReportInterface {
  id?: string;
  report_data: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface FinancialReportGetQueryInterface extends GetQueryInterface {
  id?: string;
  report_data?: string;
  user_id?: string;
}
