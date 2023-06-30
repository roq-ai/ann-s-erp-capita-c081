import axios from 'axios';
import queryString from 'query-string';
import { PerformanceAppraisalInterface, PerformanceAppraisalGetQueryInterface } from 'interfaces/performance-appraisal';
import { GetQueryInterface } from '../../interfaces';

export const getPerformanceAppraisals = async (query?: PerformanceAppraisalGetQueryInterface) => {
  const response = await axios.get(`/api/performance-appraisals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPerformanceAppraisal = async (performanceAppraisal: PerformanceAppraisalInterface) => {
  const response = await axios.post('/api/performance-appraisals', performanceAppraisal);
  return response.data;
};

export const updatePerformanceAppraisalById = async (
  id: string,
  performanceAppraisal: PerformanceAppraisalInterface,
) => {
  const response = await axios.put(`/api/performance-appraisals/${id}`, performanceAppraisal);
  return response.data;
};

export const getPerformanceAppraisalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/performance-appraisals/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deletePerformanceAppraisalById = async (id: string) => {
  const response = await axios.delete(`/api/performance-appraisals/${id}`);
  return response.data;
};
