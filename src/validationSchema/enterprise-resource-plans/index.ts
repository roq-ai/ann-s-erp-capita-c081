import * as yup from 'yup';

export const enterpriseResourcePlanValidationSchema = yup.object().shape({
  plan_data: yup.string().required(),
  user_id: yup.string().nullable(),
});
