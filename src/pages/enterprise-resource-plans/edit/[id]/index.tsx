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
import { getEnterpriseResourcePlanById, updateEnterpriseResourcePlanById } from 'apiSdk/enterprise-resource-plans';
import { Error } from 'components/error';
import { enterpriseResourcePlanValidationSchema } from 'validationSchema/enterprise-resource-plans';
import { EnterpriseResourcePlanInterface } from 'interfaces/enterprise-resource-plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function EnterpriseResourcePlanEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EnterpriseResourcePlanInterface>(
    () => (id ? `/enterprise-resource-plans/${id}` : null),
    () => getEnterpriseResourcePlanById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EnterpriseResourcePlanInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEnterpriseResourcePlanById(id, values);
      mutate(updated);
      resetForm();
      router.push('/enterprise-resource-plans');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EnterpriseResourcePlanInterface>({
    initialValues: data,
    validationSchema: enterpriseResourcePlanValidationSchema,
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
            Edit Enterprise Resource Plan
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
            <FormControl id="plan_data" mb="4" isInvalid={!!formik.errors?.plan_data}>
              <FormLabel>Plan Data</FormLabel>
              <Input type="text" name="plan_data" value={formik.values?.plan_data} onChange={formik.handleChange} />
              {formik.errors.plan_data && <FormErrorMessage>{formik.errors?.plan_data}</FormErrorMessage>}
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
    entity: 'enterprise_resource_plan',
    operation: AccessOperationEnum.UPDATE,
  }),
)(EnterpriseResourcePlanEditPage);
