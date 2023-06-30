import axios from 'axios';
import queryString from 'query-string';
import {
  EnterpriseResourcePlanInterface,
  EnterpriseResourcePlanGetQueryInterface,
} from 'interfaces/enterprise-resource-plan';
import { GetQueryInterface } from '../../interfaces';

export const getEnterpriseResourcePlans = async (query?: EnterpriseResourcePlanGetQueryInterface) => {
  const response = await axios.get(`/api/enterprise-resource-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEnterpriseResourcePlan = async (enterpriseResourcePlan: EnterpriseResourcePlanInterface) => {
  const response = await axios.post('/api/enterprise-resource-plans', enterpriseResourcePlan);
  return response.data;
};

export const updateEnterpriseResourcePlanById = async (
  id: string,
  enterpriseResourcePlan: EnterpriseResourcePlanInterface,
) => {
  const response = await axios.put(`/api/enterprise-resource-plans/${id}`, enterpriseResourcePlan);
  return response.data;
};

export const getEnterpriseResourcePlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/enterprise-resource-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteEnterpriseResourcePlanById = async (id: string) => {
  const response = await axios.delete(`/api/enterprise-resource-plans/${id}`);
  return response.data;
};
