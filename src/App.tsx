import React from "react";
import { Formik, Field, Form, useField,FieldAttributes, FieldArray } from "formik";
import * as yup from 'yup';
import {
  TextField,
  Button,
  Checkbox,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

type MyRadioProps = {label: string} & FieldAttributes<{}>;

const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
  const [field] = useField<{}>(props);

  return <FormControlLabel {...field}  control={<Radio />} label={label}/>;
};

const MyTextField : React.FC<FieldAttributes<{}>> = ({ placeholder, ...props }) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error  && meta.touched ? meta.error  : "";
  return(<TextField placeholder={placeholder} {...field} helperText={errorText} error={!!errorText} />);
};

const validationSchema = yup.object({
  firstName: yup.string().required().max(10),
  pets : yup.array().of(yup.object({name: yup.string().required()}))
});

const App = () => {
  return (
    <div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          isTall: false,
          cookies: [],
          yogurt: "",
          pets: [{type:'cat', name:"jarvis",id:"" + Math.random()}]
        }}
        validationSchema = {validationSchema}
        // validate={ (values) => {
        //   const errors:Record<string,string> = {};
        //   if(values.firstName.includes('bob')){
        //     errors.firstName = "No bob";
        //   }
        //   return errors;
        // }}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          //make async call
          console.log(data);
          setSubmitting(false);
        }}
      >
        {(
          { values, isSubmitting,errors, handleChange, handleBlur, handleSubmit } // values will give you the values of the current state of the form
        ) => (
          <Form onSubmit={handleSubmit}>
            <MyTextField 
              placeholder="first name"
              name="firstName"
             />
            {/* <Field
              placeholder="first name"
              name="firstName"
              type="input"
              as={TextField}
            /> */}
            <div>
              <Field
                placeholder="last name"
                name="lastName"
                type="input"
                as={TextField}
              />
            </div>
            <div>
              <Field name="isTall" type="checkbox" as={Checkbox} />
            </div>
            {/* multiple checkboxes */}
            <div>
              <Field
                name="cookies"
                type="checkbox"
                value="chocolate chips"
                as={Checkbox}
              />
              <Field
                name="cookies"
                type="checkbox"
                value="snickerdoodle"
                as={Checkbox}
              />
              <Field
                name="cookies"
                type="checkbox"
                value="sugar"
                as={Checkbox}
              />
            </div>
            {/* select one value from multiple radio buttons and save it in yogurt string value */}
            <div>Yogurt</div>
            <MyRadio name="yogurt" type="radio" value="peach" label="peach"/>
            <MyRadio name="yogurt" type="radio" value="blueberry" label="blueberry"/>
            <MyRadio name="yogurt" type="radio" value="apple" label="apple"/>
            {/* <Field name="yogurt" type="radio" value="peach" as={Radio}></Field> */}
            {/* <Field
              name="yogurt"
              type="radio"
              value="blueberry"
              as={Radio}
            ></Field>
            <Field name="yogurt" type="radio" value="apple" as={Radio}></Field> */}
            {/* <TextField 
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}/> */}
                     <FieldArray name="pets">
                {arrayHelpers => (
                    <div>
                      <Button onClick={() => arrayHelpers.push({
                        type: "frog",
                        name: "",
                        id: "" + Math.random()
                      })}>Add Pet</Button>
                      {values.pets.map((pet,i) => {
                        const name=`pets.${i}.name`;
                        const type = `pets.${i}.type`;

                        return (<div key={pet.id}>
                          <MyTextField 
                             placeholder="pet name"
                             name={name} />

                             <Field name={type} type="select" as={Select}>
                               <MenuItem value="cat">Cat</MenuItem>
                               <MenuItem value="dog">Dog</MenuItem>
                               <MenuItem value="frog">Frog</MenuItem>
                             </Field>
                             <Button onClick={() => arrayHelpers.remove(i)}>x</Button>
                        </div>)
                      })
                      }
                    </div>
                )}
              </FieldArray>
            <div>
              <Button type="submit" disabled={isSubmitting}>
                submit
              </Button>
              <pre>{JSON.stringify(values, null, 2)}</pre>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
