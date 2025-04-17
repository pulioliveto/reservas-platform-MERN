import React, { useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { FaWhatsapp } from 'react-icons/fa';
import CountryFlag from 'react-country-flag';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const PhoneInputWhatsApp = ({ value, onChange }) => {
  // Inicializa el estado a partir del value recibido (si existe)
  const getInitialState = () => {
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        return {
          country: {
            value: phoneNumber.country,
            label: phoneNumber.country,
            code: phoneNumber.country
          },
          number: phoneNumber.nationalNumber || ''
        };
      }
    }
    return {
      country: { value: 'AR', label: 'Argentina', code: 'AR' },
      number: ''
    };
  };

  const [country, setCountry] = React.useState(getInitialState().country);
  const [number, setNumber] = React.useState(getInitialState().number);

  React.useEffect(() => {
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        setCountry({ value: phoneNumber.country, label: phoneNumber.country, code: phoneNumber.country });
        setNumber(phoneNumber.nationalNumber || '');
      }
    }
  }, [value]);

  // Genera la lista de países con banderas y códigos
  const options = useMemo(() =>
    countryList().getData().map(c => ({
      value: c.value,
      label: (
        <span>
          <CountryFlag countryCode={c.value} svg style={{ width: 20, marginRight: 8 }} />
          {c.label}
        </span>
      ),
      code: c.value
    })),
    []
  );

  // Maneja el cambio de país
  const handleCountryChange = (selected) => {
    setCountry(selected);
    onChange(selected ? `+${getCountryCallingCode(selected.code)}${number}` : number);
  };

  // Maneja el cambio de número
  const handleNumberChange = (e) => {
    setNumber(e.target.value);
    onChange(country ? `+${getCountryCallingCode(country.code)}${e.target.value}` : e.target.value);
  };

  // Utilidad para obtener el código de país (puedes usar una librería más robusta si quieres)
  function getCountryCallingCode(code) {
    // Solo algunos ejemplos, puedes expandirlo o usar 'libphonenumber-js' para más países
    const codes = { AR: '54', ES: '34', US: '1' };
    return codes[code] || '';
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <FaWhatsapp size={24} color="#25D366" />
      <Select
        options={options}
        value={country}
        onChange={handleCountryChange}
        className="flex-grow-1"
        styles={{ container: base => ({ ...base, minWidth: 120, maxWidth: 180 }) }}
        placeholder="País"
      />
      <input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder="Teléfono"
        className="form-control"
        style={{ maxWidth: 180 }}
      />
    </div>
  );
};

export default PhoneInputWhatsApp;
