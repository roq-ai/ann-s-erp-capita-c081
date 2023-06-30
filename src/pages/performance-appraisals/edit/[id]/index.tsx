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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPerformanceAppraisalById, updatePerformanceAppraisalById } from 'apiSdk/performance-appraisals';
import { Error } from 'components/error';
import { performanceAppraisalValidationSchema } from 'validationSchema/performance-appraisals';
import { PerformanceAppraisalInterface } from 'interfaces/performance-appraisal';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function PerformanceAppraisalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PerformanceAppraisalInterface>(
    () => (id ? `/performance-appraisals/${id}` : null),
    () => getPerformanceAppraisalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PerformanceAppraisalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePerformanceAppraisalById(id, values);
      mutate(updated);
      resetForm();
      router.push('/performance-appraisals');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PerformanceAppraisalInterface>({
    initialValues: data,
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
            Edit Performance Appraisal
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(PerformanceAppraisalEditPage);
