export const valueMap: { [key: number]: ValueType } = {
    0: 'Any',
    1: 'Color',
    2: 'Time',
    3: 'Date',
    4: 'DateTime',
    5: 'Boolean',
    6: 'Text',
    7: 'TextArea',
    8: 'Url',
    9: 'PhoneNumber',
    10: 'Number',
};

export const mapToValueType = (value: number): ValueType => {
    return valueMap[value];
};
