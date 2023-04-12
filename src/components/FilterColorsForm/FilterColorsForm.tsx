import styles from './FilterColorsForm.module.scss'
import { ColorDto } from '../../Controllers/ColorsController';
import React from 'react';

interface FilterColorsFormProps {
    colors: ColorDto[];
    onGetAllColors: () => void;
    onRemoveColor: (colorId: number) => void;
}

class FilterColorsForm extends React.Component<FilterColorsFormProps> {

    state = {
        redFilter: false,
        greenFilter: false,
        blueFilter: false,
        saturationFilter: false,
        colorsToDisplay: this.props.colors
    }

    removeColorHandler = (colorId: number) => {

        const confirm: boolean = window.confirm('Remove color?');
        if (!confirm) return;

        this.props.onRemoveColor(colorId)
    }

    filterColors = () => {
        const newColorsPackData: ColorDto[] = [];
        const colors = this.props.colors;
        for (const singleColor of colors) {
            let displayColor = true;
            const red: number = parseInt(singleColor.colorValue.substring(1, 3), 16);
            const green: number = parseInt(singleColor.colorValue.substring(3, 5), 16);
            const blue: number = parseInt(singleColor.colorValue.substring(5, 7), 16);
            const saturation: number = this.getSaturation(singleColor.colorValue);

            if (this.state.redFilter && red <= 127) displayColor = false;
            if (this.state.greenFilter && green <= 127) displayColor = false;
            if (this.state.blueFilter && blue <= 127) displayColor = false;
            if (this.state.saturationFilter && saturation <= 50) displayColor = false;

            console.log(this.state.redFilter)

            displayColor && newColorsPackData.push(singleColor);
        }
        this.setState({ colorsToDisplay: newColorsPackData });
    }

    changeRedFilterHandler = () => {
        const redFilterValue = !this.state.redFilter;
        this.setState({ redFilter: redFilterValue }, () => {
            this.filterColors();
        });
    };

    changeGreenFilterHandler = () => {
        const greenFilterValue = !this.state.greenFilter;
        this.setState({ greenFilter: greenFilterValue }, () => {
            this.filterColors();
        });
    };

    changeBlueFilterHandler = () => {
        const blueFilterValue = !this.state.blueFilter;
        this.setState({ blueFilter: blueFilterValue }, () => {
            this.filterColors();
        });
    };

    changeSaturationFilterHandler = () => {
        const saturationFilterValue = !this.state.saturationFilter;
        this.setState({ saturationFilter: saturationFilterValue }, () => {
            this.filterColors();
        });
    };

    getSaturation = (color: string): number => {
        const hex = color.slice(1);
        const rgb = [
          parseInt(hex.substring(0, 2), 16) / 255,
          parseInt(hex.substring(2, 4), 16) / 255, 
          parseInt(hex.substring(4, 6), 16) / 255,
        ];
        const [r, g, b] = rgb;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const lightness = (max + min) / 2;
        const chroma = max - min;
        let saturation = 0;
        if (chroma !== 0) {
          saturation = chroma / (1 - Math.abs(2 * lightness - 1));
        }
        return Math.round(saturation * 100);
      }

    componentDidMount() {
        this.filterColors();
        console.log(this.state.redFilter)
    }

    componentDidUpdate(prevProps: FilterColorsFormProps) {
        if (prevProps.colors !== this.props.colors) {
            this.filterColors();
        }
    }


    render() {
        return (
            <div className={styles.container}>

                <div className={styles.bottomContainer}>

                    <div className={styles.filtersName}>Filters</div>


                    <div className={styles.filtersContainer}>
                        <div onClick={this.changeRedFilterHandler} className={styles.filterPart}>
                            <input checked={this.state.redFilter} onClick={this.changeRedFilterHandler} type='checkbox' /> Red {'>'} 50%
                        </div>

                        <div onClick={this.changeGreenFilterHandler} className={styles.filterPart}>
                            <input checked={this.state.greenFilter} onClick={this.changeGreenFilterHandler} type='checkbox' /> Green {'>'} 50%
                        </div>

                        <div onClick={this.changeBlueFilterHandler} className={styles.filterPart}>
                            <input checked={this.state.blueFilter} onClick={this.changeBlueFilterHandler} type='checkbox' /> Blue {'>'} 50%
                        </div>

                        <div onClick={this.changeSaturationFilterHandler} className={styles.filterPart}>
                            <input checked={this.state.saturationFilter} onClick={this.changeSaturationFilterHandler} type='checkbox' /> Saturation {'>'} 50%
                        </div>
                    </div>


                    <div className={styles.colorsName}>Colors:</div>


                    <div className={styles.colorsContainer}>

                        {this.state.colorsToDisplay.map(color => (
                            <div key={color.number} className={styles.colorContainer}>
                                <div>
                                    <div className={styles.rectangleContainer}>
                                        <div className={styles.rectangle} style={{ backgroundColor: color.colorValue }} />
                                    </div>

                                    <div className={styles.colorValue}>
                                        {color.colorValue}
                                    </div>

                                </div>

                                <div className={styles.buttonContainer}>
                                    {color.createdByUser ? (
                                        <button
                                            className={styles.button}
                                            onClick={() => color.number !== undefined
                                                &&
                                                this.removeColorHandler(color.number)}>
                                            X
                                        </button>
                                    ) : null
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        );
    }
}

export default FilterColorsForm;