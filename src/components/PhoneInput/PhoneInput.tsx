import { Select } from 'antd';
import Input, { InputProps } from 'antd/lib/input';
import metadata from 'libphonenumber-js/metadata.min.json';
import { AsYouType, CountryCode } from 'libphonenumber-js/min';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

const countryOptions = ['None', ...Object.keys(metadata.countries)];

const countrySelect = (
    country: string,
    onChange: (value: string) => void,
    isDisabled: boolean | undefined
) => (
    <Select
        disabled={isDisabled}
        defaultValue="US"
        style={{ width: 100 }}
        value={country}
        onChange={onChange}
    >
        {countryOptions.map((x, i) => (
            <Option key={i} value={x}>
                {x}
            </Option>
        ))}
    </Select>
);

export const PhoneInput: React.FC<
    { onChange: (value: string) => void } & Omit<InputProps, 'onChange'>
> = props => {
    const { onChange, value, disabled, ...rest } = props;
    const [country, setCountry] = useState<CountryCode>('US');
    const [number, setNumber] = useState(value);
    let asYouType: AsYouType = new AsYouType(country);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value: targetValue } = event.target;

        if (targetValue && asYouType) {
            asYouType.reset();
            const newValue = asYouType.input(targetValue);
            setNumber(newValue);
            onChange(newValue);
        }
    }

    function handleCountryChange(countryValue: string) {
        setCountry(countryValue as CountryCode);
        asYouType = new AsYouType(countryValue as CountryCode);
        asYouType.reset();
        const newValue = asYouType.input(number as string);
        setNumber(newValue);
        onChange(newValue);
    }

    return (
        <Input
            addonBefore={countrySelect(country, handleCountryChange, disabled)}
            onChange={handleChange}
            disabled={disabled}
            value={number}
            {...rest}
        />
    );
};
