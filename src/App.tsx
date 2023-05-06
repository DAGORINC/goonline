import { useCallback, useEffect, useState } from 'react';
import './App.scss';
import AddColorForm from './components/AddColorForm/AddColorForm';
import FilterColorsForm from './components/FilterColorsForm/FilterColorsForm';
import ColorsController, { ColorDto } from './Controllers/ColorsController';
import predefinedColors from './components/FilterColorsForm/predefinedColors';

const App = () => {

  const [colors, setColors] = useState<ColorDto[]>([]);


  const getAllColors = useCallback(async () => {
    const res = await ColorsController.getAllColors();
    const userColors: ColorDto[] = res.colors;
    const defaultColors: ColorDto[] = predefinedColors;

    const allColors: ColorDto[] = userColors.concat(defaultColors)

    allColors.sort((colorA, colorB) => {
      // Compare colors in the order r > g > b
      if (colorA.colorValue > colorB.colorValue) {
        return -1;
      } else if (colorA.colorValue < colorB.colorValue) {
        return 1;
      } else {
        return 0;
      }
    });

    setColors(allColors);

  }, [

  ]);


  const removeColor = useCallback(async (colorId: number) => {
    await ColorsController.removeColor(colorId)
    getAllColors()
  }, [
    getAllColors,
  ])



  useEffect(() => {
    getAllColors();
  }, [
    getAllColors,
  ])


  return (
    <div className="App">


      <AddColorForm onGetAllColors={getAllColors} />

      <FilterColorsForm
        colors={colors}
        onGetAllColors={getAllColors}
        onRemoveColor={removeColor}
      />

    </div>
  );
}

export default App;
