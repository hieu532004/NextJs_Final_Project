 


"use client";
import { useState, useEffect } from 'react';
import { Select, message, Form } from 'antd';

const { Option } = Select;

interface Location {
  id: number;
  full_name: string;
}

interface AddressSelectorProps {
  setCities?: React.Dispatch<React.SetStateAction<Location[]>>;
  setDistricts?: React.Dispatch<React.SetStateAction<Location[]>>;
  setCommunes?: React.Dispatch<React.SetStateAction<Location[]>>;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  setCities: setCitiesProp,
  setDistricts: setDistrictsProp,
  setCommunes: setCommunesProp,
}) => {
  const form = Form.useFormInstance();

  const [cities, setCities] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [communes, setCommunes] = useState<Location[]>([]);

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingCommunes, setLoadingCommunes] = useState<boolean>(false);

  useEffect(() => {
    if (setCitiesProp) setCitiesProp(cities);
  }, [cities, setCitiesProp]);

  useEffect(() => {
    if (setDistrictsProp) setDistrictsProp(districts);
  }, [districts, setDistrictsProp]);

  useEffect(() => {
    if (setCommunesProp) setCommunesProp(communes);
  }, [communes, setCommunesProp]);

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
      const data = await response.json();
      if (data.error === 0) setCities(data.data as Location[]);
      else message.error("Không thể tải thông tin tỉnh/thành phố.");
    } catch {
      message.error("Lỗi khi tải thông tin tỉnh/thành phố.");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityChange = async (cityId: number) => {
    form.setFieldsValue({ city: cityId, district: undefined, commune: undefined });
    setSelectedCity(cityId);
    setSelectedDistrict(null);
    setCommunes([]);
    setLoadingDistricts(true);

    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`);
      const data = await response.json();
      if (data.error === 0) setDistricts(data.data as Location[]);
      else message.error("Không thể tải thông tin quận/huyện.");
    } catch {
      message.error("Lỗi khi tải thông tin quận/huyện.");
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleDistrictChange = async (districtId: number) => {
    form.setFieldsValue({ district: districtId, commune: undefined });
    setSelectedDistrict(districtId);
    setCommunes([]);
    setLoadingCommunes(true);

    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const data = await response.json();
      if (data.error === 0) setCommunes(data.data as Location[]);
      else message.error("Không thể tải thông tin phường/xã.");
    } catch {
      message.error("Lỗi khi tải thông tin phường/xã.");
    } finally {
      setLoadingCommunes(false);
    }
  };

  const handleCommuneChange = (communeId: number) => {
    form.setFieldsValue({ commune: communeId });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 w-full">
      <Form.Item
        name="city"
        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
        className="flex-1"
      >
        <div>
          <label className="block text-lg font-medium">Tỉnh/Thành phố</label>
          <Select
            placeholder="Chọn tỉnh/thành phố"
            style={{ width: '100%' }}
            onChange={handleCityChange}
            onFocus={fetchCities}
            loading={loadingCities}
            className="rounded-lg"
          >
            {cities.map((city) => (
              <Option key={city.id} value={city.id}>
                {city.full_name}
              </Option>
            ))}
          </Select>
        </div>
      </Form.Item>

      <Form.Item
        name="district"
        rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
        className="flex-1"
      >
        <div>
          <label className="block text-lg font-medium">Quận/Huyện</label>
          <Select
            placeholder="Chọn quận/huyện"
            style={{ width: '100%' }}
            onChange={handleDistrictChange}
            disabled={!selectedCity}
            loading={loadingDistricts}
            className="rounded-lg"
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.full_name}
              </Option>
            ))}
          </Select>
        </div>
      </Form.Item>

      <Form.Item
        name="commune"
        rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
        className="flex-1"
      >
        <div>
          <label className="block text-lg font-medium">Phường/Xã</label>
          <Select
            placeholder="Chọn phường/xã"
            style={{ width: '100%' }}
            onChange={handleCommuneChange}
            disabled={!selectedDistrict}
            loading={loadingCommunes}
            className="rounded-lg"
          >
            {communes.map((commune) => (
              <Option key={commune.id} value={commune.id}>
                {commune.full_name}
              </Option>
            ))}
          </Select>
        </div>
      </Form.Item>
    </div>
  );
};

export default AddressSelector;