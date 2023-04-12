

export interface ColorDto {
    colorValue: string,
    createdByUser: boolean,
    number?: number,
}

const addNewColor = async (newColor: ColorDto) => {

    const colors: { colorValue: string; createdByUser: boolean }[] | null = JSON.parse(
        localStorage.getItem('colors') || 'null'
    );

    if (colors) {
        colors.push(newColor);
        localStorage.setItem('colors', JSON.stringify(colors));
    } else {
        localStorage.setItem('colors', JSON.stringify([newColor]));
    }

};


export interface GetAllColors {
    colors: ColorDto[];
}

const getAllColors = async (): Promise<GetAllColors> => {
    const colors: ColorDto[] = JSON.parse(localStorage.getItem('colors') || '[]');

    const result: GetAllColors = {
        colors: colors.map((color, index) => ({ ...color, number: index }))
        // dodanie do każdego elementu tablicy kolorów pola "index" 
    };


    return result;
};


const removeColor = async (colorId: number) => {
    const colors: ColorDto[] = JSON.parse(localStorage.getItem('colors') || '[]');

    // używamy metody map do przypisania nowych numerów do kolorów
    const colors2 = colors.map((color, index) => ({ ...color, number: index }));

    // filtrujemy kolory poza kolorem o określonym numerze
    const colorsAfterRemove = colors2.filter(color => color.number !== colorId && color.number !== undefined);

    localStorage.setItem('colors', JSON.stringify(colorsAfterRemove));
  };


const ColorsController = {
    addNewColor,
    getAllColors,
    removeColor,
}

export default ColorsController;