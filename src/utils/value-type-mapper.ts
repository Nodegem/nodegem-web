export const valueMap: { [key: number]: ValueType } = {
    0: 'Any',
    1: 'Color',
    2: 'Time',
    3: 'Date',
    4: 'Date Time',
    5: 'Boolean',
    6: 'Text',
    7: 'Text Area',
    8: 'Url',
    9: 'Phone Number',
    10: 'Number',
};

export const mapToValueType = (value: number): ValueType => {
    return valueMap[value];
};
