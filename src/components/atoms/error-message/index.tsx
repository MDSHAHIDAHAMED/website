import React from 'react';
import { FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';

type ErrorProps = {
  errorMsg: string;
};
const ErrorMessage = (props: ErrorProps) => {
  const { errorMsg } = props;
  return <FormHelperText error>{errorMsg}</FormHelperText>;
};

export default ErrorMessage;
ErrorMessage.propTypes = {
  errorMsg: PropTypes.string.isRequired,
};
