import * as yup from 'yup';

export const financialReportValidationSchema = yup.object().shape({
  report_data: yup.string().required(),
  user_id: yup.string().nullable(),
});
