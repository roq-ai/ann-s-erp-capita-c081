import * as yup from 'yup';

export const managementInformationSystemValidationSchema = yup.object().shape({
  system_data: yup.string().required(),
  user_id: yup.string().nullable(),
});
