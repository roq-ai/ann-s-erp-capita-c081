import axios from 'axios';
import queryString from 'query-string';
import { HumanResourcePlanInterface, HumanResourcePlanGetQueryInterface } from 'interfaces/human-resource-plan';
import { GetQueryInterface } from '../../interfaces';

export const getHumanResourcePlans = async (query?: HumanResourcePlanGetQueryInterface) => {
  const response = await axios.get(`/api/human-resource-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHumanResourcePlan = async (humanResourcePlan: HumanResourcePlanInterface) => {
  const response = await axios.post('/api/human-resource-plans', humanResourcePlan);
  return response.data;
};

export const updateHumanResourcePlanById = async (id: string, humanResourcePlan: HumanResourcePlanInterface) => {
  const response = await axios.put(`/api/human-resource-plans/${id}`, humanResourcePlan);
  return response.data;
};

export const getHumanResourcePlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/human-resource-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHumanResourcePlanById = async (id: string) => {
  const response = await axios.delete(`/api/human-resource-plans/${id}`);
  return response.data;
};
