import styles from './AddColorForm.module.scss'
import { FC, useCallback, useState } from 'react';
import ColorsController, { ColorDto } from '../../Controllers/ColorsController';

interface AddColorFormProps {
    onGetAllColors: () => void;
}

const AddColorForm: FC<AddColorFormProps> = (props) => {

    const [color, setColor] = useState<string>('')


    const validation = useCallback((): boolean => {

        const hexRgbValidation = /^#([a-fA-F0-9]{6})$/;
        const isValidate = color.match(hexRgbValidation);

        if (isValidate) return true;

        return false;
    }, [
        color
    ])

    const colorInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

        const inputValue = e.target.value as string;
        const inputValueCheck = e.target.value.substring(1) as string;
        const allowedCharacters = /[a-fA-F0-9]/;

        if ((inputValue.length === 1 && !inputValue.includes('#')) || // Check if the first character is #
            inputValueCheck.length > 6 || // Check the length of the entered color
            ((Array.from(inputValueCheck).some((char) => !char.match(allowedCharacters))) && inputValueCheck.length !== 0)) { // Check if all characters after # are from the allowed range
            e.preventDefault();
            return;
        }

        setColor(e.target.value)
    };


    const onSubmit = useCallback(async () => {
        const data: ColorDto = {
            colorValue: color.toUpperCase(),
            createdByUser: true,
        }

        if (!validation()) {
            return;
        }

        await ColorsController.addNewColor(data)
        props.onGetAllColors();
        setColor('#');
    }, [
        color,
        props,
        validation,
    ])


    return (
        <div className={styles.container}>

            <div className={styles.bottomContainer}>

                <div className={styles.addColor}>
                    Type color:
                </div>

                <div className={styles.inputAndButton}>
                    <div>
                        <input 
                        type='text' 
                        value={color} 
                        className={styles.input} 
                        placeholder='#' 
                        onChange={colorInputHandler}
                        onKeyDown={e => e.key === 'Enter' && onSubmit()}
                        />
                    </div>

                    <div>
                        <button onClick={onSubmit} className={styles.button}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddColorForm;