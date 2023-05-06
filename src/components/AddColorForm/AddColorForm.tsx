import styles from './AddColorForm.module.scss'
import ColorsController, { ColorDto } from '../../Controllers/ColorsController';
import React from 'react';
import colorsImage from '../../assets/images/colors.png';

type Props = {
  onGetAllColors: () => void;
};

type State = {
  color: string;
};

class AddColorForm extends React.Component<Props, State> {
  state: State = {
    color: '',
  };

  private hexRgbValidation = /^#([a-fA-F0-9]{6})$/;

  private validation = (): boolean => {
    const isValidate = this.state.color.match(this.hexRgbValidation);
    return Boolean(isValidate);
  };

  private colorInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as string;
    const inputValueCheck = e.target.value.substring(1) as string;
    const allowedCharacters = /[a-fA-F0-9]/;
    const firstChar = inputValue.split('')[0];

    if (
      (inputValue.length === 1 && firstChar !== '#') ||
      inputValueCheck.length > 6 ||
      (Array.from(inputValueCheck).some((char) => !char.match(allowedCharacters)) &&
        inputValueCheck.length !== 0)
    ) {
      e.preventDefault();
      return;
    }

    this.setState({ color: e.target.value });
  };

  private onSubmit = async () => {
    const { color } = this.state;

    const data: ColorDto = {
      colorValue: color.toUpperCase(),
      createdByUser: true,
    };

    if (!this.validation()) {
      return;
    }

    await ColorsController.addNewColor(data);
    this.props.onGetAllColors();
    this.setState({ color: '#' });
  };

  render() {
    const { color } = this.state;

    return (
      <>
        <img src={colorsImage} style={{ height: '80vh' }} alt='theme'/>
        <div className={styles.container}>
          <div className={styles.bottomContainer}>
            <div className={styles.addColor}>Add color:</div>
            <div className={styles.inputAndButton}>
              <div>
                <input
                  type="text"
                  value={color}
                  className={styles.input}
                  placeholder="#"
                  onChange={this.colorInputHandler}
                  onKeyDown={(e) => e.key === 'Enter' && this.onSubmit()}
                />
              </div>
              <div>
                <button onClick={this.onSubmit} className={styles.button}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AddColorForm;
