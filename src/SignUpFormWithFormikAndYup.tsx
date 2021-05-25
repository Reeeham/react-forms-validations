import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { ErrorMessage, Field,FieldInputProps, Form, Formik } from 'formik';
import React, { ReactNode } from 'react';
import * as Yup from 'yup';



///////////////////input field////////////
interface FormikFieldProps { 
    name: string;
    label: string;
    type?: string;
    required: boolean;
}


const FormikField: React.FC<FormikFieldProps> = ({name,label,type="text",required = false}) => {
    return(
        <div style= {{  margin: '10px 0' }}>
            <Field
              required={required}
              autoComplete="off"
              as={TextField}
              label={label}
              name={name}
              fullWidth
              type={type}
              helperText={<ErrorMessage name={name}/>}
            />
        </div>
    );
};
///////////////select/////////////////
interface FormikSelectItem {
    label: string;
    value: string;
  }

interface FormikSelectProps{
    name: string;
    items: FormikSelectItem[];
    label: string;
    required?: boolean;

}
interface MaterialUISelectFieldProps extends FieldInputProps<string>{
    errorString?: string;
    children: ReactNode;
    label: string;
    required: boolean;
}

const MaterialUISelectField: React.FC<MaterialUISelectFieldProps> = ({
    errorString,
    label,
    children,
    value,
    name,
    onChange,
    onBlur,
    required
  }) => { 
      return(
          <FormControl fullWidth>
              <InputLabel required={required}>{label}</InputLabel>
              <Select name={name} onChange={onChange} onBlur={onBlur} value={value}>
                  {children}
              </Select>
              <FormHelperText>{errorString}</FormHelperText>
          </FormControl>

      );
  };

const FormikSelect: React.FC<FormikSelectProps>=({name, items, label,required = false}) => { 
    return(
    <div style={{margin: '10px 0' }}>
        <Field
            name={name}
            as={MaterialUISelectField}
            label={label}
            errorString={<ErrorMessage name={name}/>}
            required={required}>
                {items.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Field>
    </div>);
};

/////////////////signup form/////////////////
 interface FormValues{
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    position: string;
   

}

const initialValues :FormValues = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    position: ""
  };

const positionItems: FormikSelectItem[] = [
    {
        label: "Front End",
        value: "front_end"
    },
    {
        label: "Back End",
        value: "back_end"
    },
    {
        label: "Dev Ops",
        value: "dev_ops"
    },
    {
        label: "QA",
        value: "qa"
    }
];
const emailAddresses = [
    'test@gmail.com',
    'test2@gmail.com',
    'test3@gmail.com',

]

const lowercaseRegex = /(?=.*[a-z])/;
const uppercaseRegex = /(?=.*[A-Z])/;
const numericCaseRegex = /(?=.*[0-9])/; 

const SignupSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Required"),
    email: Yup.string().lowercase().email("Must be a valid email")
              .notOneOf(emailAddresses, "Email Already taken")
              .min(8,"Minimum characters is required")
              .required("Required"),
    password: Yup.string().required("Required")
                  .matches(lowercaseRegex,"One lowercase required")
                  .matches(uppercaseRegex,"One uppercase required")
                  .matches(numericCaseRegex,"must contain at least 1 numeric character")
                  .min(8,"Minimum characters is required"),
    passwordConfirm: Yup.string().required("Required").oneOf([Yup.ref('password')],"Passwords must be the same"),
    position: Yup.string().required("Required")
});


const SignUpFormExample:React.FC = () => { 
    const handleSubmit = (values: FormValues): void => {
        alert(JSON.stringify(values));
    };
    return(
        <div style={{background: 'white',
            borderRadius: '10px',
            width: '500px',
            padding: '50px'}}>
            <h1>Sign Up</h1>
            <Formik 
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={SignupSchema}>
                  {({dirty, isValid}) => {
                      return(
                      <Form>
                          <FormikField name="name" label="Name" required/>
                          <FormikField name="email" label="Email" required/>
                          <FormikField name="password" label="Password" type="password" required/>
                          <FormikField name="passwordConfirm" label="Confirm Password" type="password" required/>
                          <FormikSelect 
                          name="position"
                          items={positionItems}
                          label="Position"
                          required
                          />
                          <Button variant="contained"
                                   color="primary"
                                   disabled={!dirty || !isValid}
                                   type="submit">
                              Primary
                          </Button>
                      </Form>)
                  }}
            </Formik>
        </div>
    )
}

export default SignUpFormExample;