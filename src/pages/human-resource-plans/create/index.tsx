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
import { createHumanResourcePlan } from 'apiSdk/human-resource-plans';
import { Error } from 'components/error';
import { humanResourcePlanValidationSchema } from 'validationSchema/human-resource-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { HumanResourcePlanInterface } from 'interfaces/human-resource-plan';

function HumanResourcePlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HumanResourcePlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHumanResourcePlan(values);
      resetForm();
      router.push('/human-resource-plans');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HumanResourcePlanInterface>({
    initialValues: {
      plan_data: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: humanResourcePlanValidationSchema,
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
            Create Human Resource Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    entity: 'human_resource_plan',
    operation: AccessOperationEnum.CREATE,
  }),
)(HumanResourcePlanCreatePage);
