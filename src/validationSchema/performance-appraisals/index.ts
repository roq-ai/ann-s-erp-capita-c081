import * as yup from 'yup';

export const performanceAppraisalValidationSchema = yup.object().shape({
  appraisal_data: yup.string().required(),
  user_id: yup.string().nullable(),
});
