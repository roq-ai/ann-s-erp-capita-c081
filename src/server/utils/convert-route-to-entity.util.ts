const mapping: Record<string, string> = {
  businesses: 'business',
  'enterprise-resource-plans': 'enterprise_resource_plan',
  'financial-reports': 'financial_report',
  'human-resource-plans': 'human_resource_plan',
  'management-information-systems': 'management_information_system',
  'performance-appraisals': 'performance_appraisal',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
