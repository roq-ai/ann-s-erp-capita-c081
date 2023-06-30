import axios from 'axios';
import queryString from 'query-string';
import {
  ManagementInformationSystemInterface,
  ManagementInformationSystemGetQueryInterface,
} from 'interfaces/management-information-system';
import { GetQueryInterface } from '../../interfaces';

export const getManagementInformationSystems = async (query?: ManagementInformationSystemGetQueryInterface) => {
  const response = await axios.get(
    `/api/management-information-systems${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const createManagementInformationSystem = async (
  managementInformationSystem: ManagementInformationSystemInterface,
) => {
  const response = await axios.post('/api/management-information-systems', managementInformationSystem);
  return response.data;
};

export const updateManagementInformationSystemById = async (
  id: string,
  managementInformationSystem: ManagementInformationSystemInterface,
) => {
  const response = await axios.put(`/api/management-information-systems/${id}`, managementInformationSystem);
  return response.data;
};

export const getManagementInformationSystemById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/management-information-systems/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteManagementInformationSystemById = async (id: string) => {
  const response = await axios.delete(`/api/management-information-systems/${id}`);
  return response.data;
};
