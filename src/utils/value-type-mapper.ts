export const valueMap: { [key: string]: ValueType } = {
    any: 'Any',
    text: 'Text',
    textarea: 'Text Area',
    boolean: 'Boolean',
    number: 'Number',
    time: 'Time',
    date: 'Date',
    datetime: 'Date Time',
    url: 'Url',
    phonenumber: 'Phone Number',
};

export const mapToValueType = (value: number): ValueType => {
    return valueMap[value];
};
