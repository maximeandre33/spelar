import { useFormContext, Controller } from 'react-hook-form'
import { TextField } from '@material-ui/core'

const FormInput = ({ name, label, required, value, onChange }) => {
    const { control } = useFormContext()
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <TextField
                    InputLabelProps={{
                        style: {
                            color: "white",
                            fontSize: '15px',
                        }
                    }}
                    InputProps={{
                        style: {
                            color: "white",
                        }
                    }}
                    variant="filled"
                    size='small'
                    {...field}
                    value={value}
                    onChange={onChange}
                    name={name}
                    label={label}
                    required={required}
                    fullWidth
                />
            )}
        />
    )
}

export default FormInput