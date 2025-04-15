import React from 'react';
import { Form } from 'react-bootstrap';

const TimePicker10Min = ({ value, onChange, disabled }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '10', '20', '30', '40', '50'];

  const handleHourChange = (e) => {
    const newHour = e.target.value;
    const [_, currentMin] = value.split(':');
    onChange(`${newHour.padStart(2, '0')}:${currentMin || '00'}`);
  };

  const handleMinuteChange = (e) => {
    const newMin = e.target.value;
    const [currentHour] = value.split(':');
    onChange(`${currentHour || '00'}:${newMin}`);
  };

  return (
    <div className="d-flex align-items-center">
      <Form.Select 
        value={value ? value.split(':')[0] : ''}
        onChange={handleHourChange}
        disabled={disabled}
        style={{ width: '70px' }}
      >
        <option value="">HH</option>
        {hours.map(hour => (
          <option key={hour} value={hour}>
            {hour.toString().padStart(2, '0')}
          </option>
        ))}
      </Form.Select>
      <span className="mx-1">:</span>
      <Form.Select
        value={value ? value.split(':')[1] : ''}
        onChange={handleMinuteChange}
        disabled={disabled}
        style={{ width: '70px' }}
      >
        <option value="">MM</option>
        {minutes.map(minute => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

export default TimePicker10Min;