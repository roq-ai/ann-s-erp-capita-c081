import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPerformanceAppraisal } from 'apiSdk/performance-appraisals';
import { Error } from 'components/error';
import { performanceAppraisalValidationSchema } from 'validationSchema/performance-appraisals';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { PerformanceAppraisalInterface } from 'interfaces/performance-appraisal';

function PerformanceAppraisalCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PerformanceAppraisalInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPerformanceAppraisal(values);
      resetForm();
      router.push('/performance-appraisals');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PerformanceAppraisalInterface>({
    initialValues: {
      appraisal_data: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: performanceAppraisalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Performance Appraisal
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="appraisal_data" mb="4" isInvalid={!!formik.errors?.appraisal_data}>
            <FormLabel>Appraisal Data</FormLabel>
            <Input
              type="text"
              name="appraisal_data"
              value={formik.values?.appraisal_data}
              onChange={formik.handleChange}
            />
            {formik.errors.appraisal_data && <FormErrorMessage>{formik.errors?.appraisal_data}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'performance_appraisal',
    operation: AccessOperationEnum.CREATE,
  }),
)(PerformanceAppraisalCreatePage);
