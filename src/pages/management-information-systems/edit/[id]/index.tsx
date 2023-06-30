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
import {
  getManagementInformationSystemById,
  updateManagementInformationSystemById,
} from 'apiSdk/management-information-systems';
import { Error } from 'components/error';
import { managementInformationSystemValidationSchema } from 'validationSchema/management-information-systems';
import { ManagementInformationSystemInterface } from 'interfaces/management-information-system';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function ManagementInformationSystemEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ManagementInformationSystemInterface>(
    () => (id ? `/management-information-systems/${id}` : null),
    () => getManagementInformationSystemById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ManagementInformationSystemInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateManagementInformationSystemById(id, values);
      mutate(updated);
      resetForm();
      router.push('/management-information-systems');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ManagementInformationSystemInterface>({
    initialValues: data,
    validationSchema: managementInformationSystemValidationSchema,
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
            Edit Management Information System
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
            <FormControl id="system_data" mb="4" isInvalid={!!formik.errors?.system_data}>
              <FormLabel>System Data</FormLabel>
              <Input type="text" name="system_data" value={formik.values?.system_data} onChange={formik.handleChange} />
              {formik.errors.system_data && <FormErrorMessage>{formik.errors?.system_data}</FormErrorMessage>}
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
    entity: 'management_information_system',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ManagementInformationSystemEditPage);
